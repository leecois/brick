'use client'

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'
import type { DefaultSession } from 'next-auth'
import { useActionState, useCallback, useEffect, useMemo, useState } from 'react'
import {
  CardStackIcon,
  CardStackPlusIcon,
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  Cross2Icon,
  DownloadIcon,
  LinkedInLogoIcon,
  MagnifyingGlassIcon,
  PaperPlaneIcon,
  Pencil1Icon,
  PersonIcon,
  PinLeftIcon,
  PlusCircledIcon,
  PlusIcon,
  TrashIcon
} from '@radix-ui/react-icons'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { saveAs } from 'file-saver'
import { AnimatePresence } from 'framer-motion'
import { useAtom } from 'jotai'
import { uniqBy } from 'lodash'
import pluralize from 'pluralize'
import { useInView } from 'react-intersection-observer'
import { jsonToCSV } from 'react-papaparse'
import { toast } from 'sonner'
import useSound from 'use-sound'
import { z } from 'zod'

import { CreateCollectionSchema } from '@a/db/schema'
import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import { Checkbox } from '@a/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@a/ui/command'
import { Dialog, DialogClose, DialogTrigger } from '@a/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger
} from '@a/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@a/ui/form'
import { Input } from '@a/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@a/ui/resizable'
import { Skeleton } from '@a/ui/skeleton'
import { TableCell, TableHead, TableRow } from '@a/ui/table'

import type { Company, Employee, Source } from '~/types'
import { getCompanies, getEmployees, getHistory } from '~/actions'
import columns from '~/column/company'
import { DialogContent } from '~/components/dialog'
import { DropdownMenuRadioItem as DropdownMenuRadioItemCheck } from '~/components/dropdown-menu'
import FakeProgress from '~/components/fake-progress'
import Hover from '~/components/hover'
import { Input as NiceInput } from '~/components/input'
import Loop from '~/components/loop'
import { Slider as Slider2 } from '~/components/slider'
import { Table, TableBody, TableHeader } from '~/components/table'
import Tutip from '~/components/tutip'
import useServerAction from '~/hook/server-action'
import useForm from '~/hook/use-form'
import {
  collectAtom,
  companiesAtom,
  employeesAtom,
  focusCollectionAtom,
  focusCompanyAtom,
  queryAtom,
  sourceAtom
} from '~/store'
import FacetedFilter from '~/table/faceted-filter'
import FacetedFilterArray from '~/table/faceted-filter-array'
import Pagination from '~/table/pagination'
import ViewOptions from '~/table/view-options'
import { api } from '~/trpc/react'
import Banner from './banner'
import example from './example'
import Gen from './gen'
import Info from './info'
import Logo from './logo'

const descriptions: Record<Source, string> = {
    europages: 'A B2B platform for suppliers and manufacturers.',
    kompass: 'A global business directory for B2B companies.',
    linkedin: 'A social network for businesses to connect.'
  },
  employeeColName = 'employeeCount',
  examples = example.map(e => e.query),
  filterArrayContain: string[] = ['searchQueries'],
  filterExact: string[] = ['industry', 'country'],
  filterText: string[] = ['description'],
  limit = 5,
  rowSingular = 'company',
  step = 100,
  threshold: number = step * 10,
  utmost: number = threshold + step

interface MyTableProps {
  readonly user: { id: string } & DefaultSession['user']
}

export default function MyTable({ user }: MyTableProps) {
  const [{ data: newData, id: historyId }, searchAction, searchPending] = useActionState(
      getCompanies as (
        state: {
          data: Company[]
          id: string
        },
        payload: unknown
      ) => Promise<{
        data: Company[]
        id: string
      }>,
      { data: [], id: '' }
    ),
    {
      data: historyPages,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
    } = api.history.infinite.useInfiniteQuery(
      { limit, user: user.id },
      { getNextPageParam: p => p.next }
    ),
    [[currentMin, currentMax], setMinMax] = useState<[number, number]>([0, 0]),
    [addCollectionOpen, setAddCollectionOpen] = useState(false),
    [collect, setCollect] = useAtom(collectAtom),
    [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]),
    [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ searchQueries: false }),
    [data, setData] = useAtom(companiesAtom),
    [employees, setEmployees] = useAtom(employeesAtom),
    [focus, setFocus] = useAtom(focusCompanyAtom),
    [focusCollection, setFocusCollection] = useAtom(focusCollectionAtom),
    [hover, setHover] = useState<number | null>(null),
    [leftPanelOpen, setLeftPanelOpen] = useState(true),
    [newCollectionMode, setNewCollectionMode] = useState(false),
    [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 }),
    [play] = useSound('ding.mp3'),
    [query, setQuery] = useAtom(queryAtom),
    [realMax, setRealMax] = useState<number>(0),
    [rowSelection, setRowSelection] = useState({}),
    [runGetEmployees, employeesPending] = useServerAction(getEmployees),
    [runGetHistory, historyPending] = useServerAction(getHistory),
    [selectMode, setSelectMode] = useState(false),
    [selection, setSelection] = useState<string[]>([]),
    [showFilter, setShowFilter] = useState(false),
    [sorting, setSorting] = useState<SortingState>([]),
    [source, setSource] = useAtom(sourceAtom),
    { data: collections } = api.collection.all.useQuery(user.id),
    { inView, ref } = useInView(),
    Api = api.useUtils(),
    CreateCollection = () => {
      const form = useForm({
          defaultValues: { name: '', user: user.id },
          schema: CreateCollectionSchema
        }),
        newCollection = api.collection.create.useMutation({
          onSuccess: async () => {
            form.reset()
            await Api.collection.invalidate()
            setNewCollectionMode(false)
          }
        })
      return (
        <Form {...form}>
          <form
            className='flex items-center'
            onSubmit={form.handleSubmit(_data => newCollection.mutate(_data))}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className='grow px-2.5 py-0'
                      placeholder='Collection name'
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {newCollection.isPending ? (
              <p className='m-1 size-7 animate-spin rounded-full border-2 border-foreground border-t-transparent' />
            ) : (
              <button>
                <CheckIcon
                  className={cn(
                    'rounded-md bg-background text-green-300 drop-shadow-md transition-all duration-500 hover:bg-green-500 hover:text-white dark:text-green-600 dark:hover:text-white',
                    form.getValues().name ? 'ml-1 size-9 border px-1' : 'size-0'
                  )}
                />
              </button>
            )}
            <Cross2Icon
              className={cn(
                'rounded-md bg-background text-red-300 drop-shadow-md transition-all duration-500 hover:bg-red-500 hover:text-white dark:text-red-600 dark:hover:text-white',
                form.getValues().name ? 'size-0' : 'ml-1 size-9 border px-1'
              )}
              onClick={() => setNewCollectionMode(false)}
            />
          </form>
        </Form>
      )
    },
    Search = () => {
      const form = useForm({
        defaultValues: { query: '', source, user: user.email },
        schema: z.object({
          query: z.string().min(4, { message: 'Query must be at least 4 characters.' }),
          source: z.enum(['linkedin', 'kompass', 'europages']),
          user: z.string()
        })
      })
      return (
        <>
          {!form.getValues().query && (
            <Loop
              className='notranslate pointer-events-none absolute left-8 top-2 w-[calc(100%-2rem)] truncate pr-px text-sm text-muted-foreground'
              texts={examples}
            />
          )}
          <Form {...form}>
            <form
              id='search'
              onSubmit={form.handleSubmit(_data => {
                searchAction(_data)
                setQuery(_data.query)
                toast.loading(`Fetching companies with query: ${_data.query}`)
              })}>
              <FormField
                control={form.control}
                name='query'
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      'notranslate transition-all duration-300',
                      !searchPending && form.getValues().query && 'mr-10'
                    )}>
                    <FormControl>
                      <NiceInput
                        className='h-8 pl-8 pr-px focus-visible:ring-orange-300 dark:focus-visible:ring-orange-600'
                        id='search-input'
                        {...field}
                        disabled={searchPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Button
            className={cn(
              'group absolute right-0 top-0 z-10 size-[2.12rem] overflow-hidden transition-all duration-300 hover:scale-110',
              (!form.getValues().query || searchPending) && '-right-7 scale-0'
            )}
            disabled={searchPending}
            form='search'
            size='icon'
            type='submit'
            variant='outline'>
            <span className='absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#fedcba_50%,#ffffff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#654321_50%,#000000_100%)]' />
            <PaperPlaneIcon className='mb-1 ml-2 mr-1 size-5 -rotate-45 opacity-80 transition-all duration-300 group-hover:scale-110' />
          </Button>
        </>
      )
    },
    _table = useReactTable({
      columns,
      data,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: data.length ? getSortedRowModel() : undefined,
      meta: query,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      state: { columnFilters, columnVisibility, pagination, rowSelection, sorting }
    }),
    colUnique = (column: string) =>
      [...(_table.getColumn(column)?.getFacetedUniqueValues() as Map<string, number>)]
        .sort(([_, a], [__, b]) => b - a)
        .map(([k, _]) => k)
        .flat()
        .filter((v, i, a) => a.indexOf(v) === i)
        .filter(Boolean),
    createHistory = api.history.create.useMutation({
      onSuccess: () => Api.history.invalidate()
    }),
    deleteHistory = api.history.delete.useMutation({
      onSuccess: () => {
        void Api.history.invalidate()
        document.getElementById('close-delete')?.click()
        setSelection([])
        setSelectMode(false)
      }
    }),
    employeeCol = _table.getColumn(employeeColName),
    handleSlide = ([newMin, newMax]: [number, number]) => {
      const _newMax = newMax === utmost ? realMax : newMax
      employeeCol?.setFilterValue([newMin, newMax])
      if (newMin === 0 && _newMax === realMax) {
        employeeCol?.setFilterValue(undefined)
      }
      setMinMax([newMin, _newMax])
    },
    history = useMemo(() => historyPages?.pages.map(p => p.items).flat(), [historyPages]),
    isFiltered: boolean = _table.getState().columnFilters.length > 0,
    updateCollection = api.collection.update.useMutation({
      onSuccess: () => Api.collection.invalidate()
    }),
    updateFilter = useCallback(
      (_data: Company[]) => {
        setColumnVisibility({
          ...columnVisibility,
          employeeCount: _data.every((c: Company) => c.employeeCount),
          industry: Boolean(_data[0]?.industry)
        })
        const _realMax = Math.max(..._data.map((c: Company) => c.employeeCount ?? 0))
        setRealMax(_realMax)
        setMinMax([0, _realMax < utmost ? _realMax : utmost])
      },
      [columnVisibility]
    )

  useEffect(() => {
    if (inView) {
      void fetchNextPage()
    }
  }, [inView, fetchNextPage])

  useEffect(
    () =>
      setData(_data =>
        _data.map(c => ({
          ...c,
          unlocked: Object.keys(employees).includes(c.id) ? true : undefined
        }))
      ),
    [employees]
  )

  useEffect(() => {
    if (newData.length > 0) {
      createHistory.mutate({ id: historyId, query, source, user: user.id })
      setData(newData)
      updateFilter(newData)
      setFocusCollection(null)
      play()
      toast.success('Fetch successfully', {
        description: `Found ${newData.length} ${pluralize(rowSingular, newData.length)}`
      })
      toast.dismiss()
    } else {
      updateFilter(data)
    }
  }, [newData, play])

  examples.unshift('Enter keywords ...')

  return (
    <ResizablePanelGroup direction='horizontal'>
      <Tutip content={`${leftPanelOpen ? 'Hide' : 'Show'} sidebar`} side='left'>
        <PinLeftIcon
          className={cn(
            'absolute top-2 z-[1001] ml-[7px] size-7 rounded-md border bg-background p-1 text-muted-foreground transition-all duration-1000 hover:bg-muted hover:text-foreground',
            !leftPanelOpen && 'top-[3px] ml-[3px] -scale-x-100'
          )}
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        />
      </Tutip>

      <ResizablePanel
        className={cn(
          'relative flex h-screen select-none flex-col !overflow-y-auto bg-background',
          !leftPanelOpen && 'hidden'
        )}
        defaultSize={14}
        maxSize={14}
        minSize={5}>
        <DropdownMenu>
          <DropdownMenuTrigger className='notranslate mx-auto mb-0.5 mt-1 flex items-center gap-2 rounded-full px-4 py-1.5 capitalize text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground hover:drop-shadow-md focus:outline-none'>
            <Logo size={20} source={source} />
            {source}
            <ChevronDownIcon className='-ml-0.5 mb-px size-4' />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='notranslate m-1.5 rounded-2xl transition-all duration-300 hover:drop-shadow-xl'>
            <DropdownMenuRadioGroup
              onValueChange={value => setSource(value as Source)}
              value={source}>
              {Object.entries(descriptions).map(([s, d], i) => (
                <DropdownMenuRadioItemCheck
                  className='w-96 gap-2 pr-5'
                  key={s}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  value={s}>
                  <AnimatePresence>
                    {hover === i && (
                      <Hover className='absolute -z-10 size-full rounded-2xl bg-muted' />
                    )}
                  </AnimatePresence>
                  <div
                    className={cn(
                      'flex items-center gap-6 py-3 pl-6',
                      s === source ? 'pr-6' : 'pr-12'
                    )}>
                    <Logo size={32} source={s as Source} />
                    <div className='flex flex-col gap-0.5'>
                      <p className='text-xl font-medium capitalize tracking-tight'>{s}</p>
                      <p className='text-pretty leading-5 text-muted-foreground'>{d}</p>
                    </div>
                  </div>
                </DropdownMenuRadioItemCheck>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {searchPending ? <FakeProgress estimate={100} /> : null}
        <div className='group relative mx-1.5 transition-all duration-300 hover:drop-shadow-lg'>
          <p
            className={cn(
              'absolute z-10 m-[5px] size-0 animate-spin rounded-full border-foreground border-t-transparent transition-all duration-500',
              searchPending && 'size-6 border-2'
            )}
          />
          <MagnifyingGlassIcon
            className={cn(
              'absolute m-[5px] size-6 text-muted-foreground transition-all duration-500 group-hover:scale-125 group-hover:text-foreground',
              searchPending && 'm-0 size-0'
            )}
          />
          <Search />
          <Gen />
        </div>
        <div className={data.length ? 'flex flex-col px-px' : 'hidden'}>
          <div
            className={cn(
              'notranslate relative flex items-center transition-all duration-700 *:transition-all *:duration-300',
              !showFilter && 'mb-1 mt-2 hover:-translate-y-0.5 hover:drop-shadow-md'
            )}>
            <Button
              className={cn(
                'mx-1.5 h-8 grow p-0 font-light transition-all duration-300 hover:text-lg hover:font-medium hover:tracking-tighter hover:opacity-100',
                !showFilter && 'text-muted-foreground'
              )}
              onClick={() => setShowFilter(!showFilter)}
              variant={showFilter ? 'ghost' : 'outline'}>
              Filter
            </Button>
            <Button
              className={cn(
                'mr-1.5 h-6 w-16 border-red-400 pl-2 pr-1 text-red-500 drop-shadow-md hover:bg-red-400 hover:text-background',
                !isFiltered && 'm-0 size-0 border-none p-0 text-[0]'
              )}
              onClick={() => {
                _table.resetColumnFilters()
                setMinMax([0, realMax < utmost ? realMax : utmost])
              }}
              size='sm'
              variant='outline'>
              Reset
              <Cross2Icon className='ml-1 size-3' />
            </Button>
          </div>
          <div
            className={cn(
              'mx-1 flex flex-wrap gap-1.5 transition-all duration-500 [&>*]:transition-all [&>*]:duration-500',
              !showFilter &&
                'gap-0 *:border-none *:*:bg-background [&>*]:m-0 [&>*]:h-0 [&>*]:p-0 [&>*]:text-[0]'
            )}>
            <Popover>
              <PopoverTrigger asChild>
                <Button className='w-full justify-start px-3 font-normal' variant='outline'>
                  {focus ? <p className='notranslate truncate'>{focus.name}</p> : 'Company'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='p-0 transition-all duration-300 hover:drop-shadow-xl'
                side='right'>
                <Command>
                  <CommandInput className='placeholder:capitalize' placeholder='company name' />
                  <CommandEmpty>No companies found.</CommandEmpty>
                  <CommandList className='m-1'>
                    {[...data]
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((company, i) => (
                        <CommandItem
                          className='notranslate'
                          key={i}
                          onSelect={() => {
                            setFocus(company)
                            _table.getColumn('name')?.setFilterValue(company.name)
                            setColumnVisibility({ ...columnVisibility, description: false })
                          }}>
                          {company.name}
                        </CommandItem>
                      ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {filterExact.map((c, i) => (
              <FacetedFilter
                column={_table.getColumn(c)}
                key={i}
                options={colUnique(c)}
                title={c}
              />
            ))}
            {realMax ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className='w-full justify-start gap-1.5 px-3 font-normal'
                    variant='outline'>
                    Employee Range
                    {currentMin < step &&
                    (currentMax === realMax || currentMax > threshold) ? null : (
                      <p className='rounded-full bg-muted px-1.5 font-medium'>
                        {`${
                          currentMin < step
                            ? `Under ${step}`
                            : currentMin <= threshold && currentMin
                        } to ${
                          currentMax > threshold
                            ? `${threshold}+`
                            : currentMax >= step && currentMax
                        }`}
                      </p>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='p-0 transition-all duration-300 hover:drop-shadow-xl'
                  side='right'>
                  <div className='mx-3 mt-2 flex justify-between px-px'>
                    <p>
                      {currentMin < step ? `Under ${step}` : currentMin <= threshold && currentMin}
                    </p>
                    <p>
                      {currentMax > threshold ? `${threshold}+` : currentMax >= step && currentMax}
                    </p>
                  </div>
                  <Slider2
                    className='mx-auto my-3 w-11/12'
                    max={realMax < utmost ? realMax : utmost}
                    min={0}
                    minStepsBetweenThumbs={0}
                    onValueChange={handleSlide}
                    step={step}
                    value={[currentMin, currentMax]}
                  />
                  <div
                    className={cn(
                      'm-1 transition-all duration-300',
                      currentMin < step &&
                        (currentMax === realMax || currentMax > threshold) &&
                        '-my-3.5 scale-0 opacity-0'
                    )}>
                    <Button
                      className='h-9 w-full text-sm font-normal'
                      onClick={() => {
                        setMinMax([0, realMax < utmost ? realMax : utmost])
                        employeeCol?.setFilterValue(undefined)
                      }}
                      variant='ghost'>
                      Clear range
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : null}
            {filterArrayContain.map((c, i) => (
              <FacetedFilterArray
                column={_table.getColumn(c)}
                key={i}
                options={colUnique(c)}
                title={c}
              />
            ))}
            {filterText.map((c, i) => (
              <Input
                className='placeholder:capitalize'
                key={i}
                onChange={event => _table.getColumn(c)?.setFilterValue(event.target.value)}
                placeholder={c}
                value={_table.getColumn(c)?.getFilterValue() as string}
              />
            ))}
            <ViewOptions className='hidden' table={_table} />
          </div>
        </div>
        {history ? (
          <>
            <div className='ml-1 mr-1.5 flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <Checkbox
                  checked={selection.length === history.length}
                  className={cn(
                    'scale-0 transition-all duration-300',
                    selectMode ? 'scale-100 hover:scale-110' : 'cursor-default'
                  )}
                  onCheckedChange={checked =>
                    checked ? setSelection(history.map(q => q.id)) : setSelection([])
                  }
                />
                {selection.length > 0 && (
                  <p className='ml-px size-5 rounded bg-muted px-0.5 text-center text-sm'>
                    {selection.length}
                  </p>
                )}
              </div>
              <p className='line-clamp-1'>History</p>
              <div className='flex items-center gap-1'>
                <Dialog>
                  <Tutip content='Delete' side='top'>
                    <DialogTrigger asChild>
                      <Button
                        className={
                          selection.length
                            ? 'size-5 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-800 dark:hover:text-red-100'
                            : 'hidden'
                        }
                        size='icon'
                        variant='outline'>
                        <TrashIcon className='size-4' />
                      </Button>
                    </DialogTrigger>
                  </Tutip>
                  <DialogContent className='w-fit p-4'>
                    {`Are you sure you want to delete ${selection.length} ${pluralize(
                      'query',
                      selection.length
                    )}?`}
                    <div className='flex justify-end gap-3'>
                      <DialogClose asChild>
                        <Button id='close-delete' variant='secondary'>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button onClick={() => deleteHistory.mutate(selection)} variant='destructive'>
                        <p
                          className={
                            deleteHistory.isPending
                              ? 'mr-1 size-4 animate-spin rounded-full border border-foreground border-t-transparent transition-all duration-500'
                              : 'size-0'
                          }
                        />
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Tutip content='Select' side='top'>
                  <Button
                    className='size-5 shadow-none transition-all duration-500'
                    onClick={() => {
                      setSelection([])
                      setSelectMode(!selectMode)
                    }}
                    size='icon'
                    variant={selectMode ? 'default' : 'outline'}>
                    <Pencil1Icon className='size-4' />
                  </Button>
                </Tutip>
              </div>
            </div>
            {history.map(q => (
              <Button
                className='group relative -my-0.5 w-full justify-start pl-1 font-normal'
                key={q.id}
                onClick={async () => {
                  if (selectMode) {
                    setSelection(
                      selection.includes(q.id)
                        ? selection.filter(s => s !== q.id)
                        : [...selection, q.id]
                    )
                  } else {
                    const historyData = await runGetHistory(user.id, q.id)
                    if (!historyData) {
                      return
                    }
                    setData(historyData)
                    updateFilter(historyData)
                    setFocusCollection(null)
                    setQuery(q.query)
                    setSource(q.source as Source)
                    play()
                    toast.success(
                      <p>
                        Fetch {historyData.length} {pluralize(rowSingular, historyData.length)} from{' '}
                        <span className='notranslate font-semibold'>{q.query}</span>
                      </p>
                    )
                    toast.dismiss()
                  }
                }}
                variant='ghost'>
                <Checkbox
                  checked={selection.includes(q.id)}
                  className={cn(
                    'transition-all duration-300 group-hover:scale-110',
                    !selectMode && 'size-0 border-transparent'
                  )}
                />
                <Logo
                  className={cn('transition-all duration-300', selectMode ? 'size-0' : 'size-4')}
                  size={16}
                  source={q.source as Source}
                />

                <p className='notranslate ml-1'>{q.query}</p>
                <p className='absolute right-0 rounded-full px-2 py-0.5 text-xs text-muted-foreground/60 backdrop-blur'>
                  <span className='group-hover:hidden'>{format(q.date, 'd/L')}</span>
                  <span className='hidden group-hover:block'>
                    {formatDistance(q.date, new Date(), { addSuffix: true })}
                  </span>
                </p>
              </Button>
            ))}
            {isFetchingNextPage ? (
              <p className='mx-auto size-5 animate-spin rounded-full border-2 border-foreground border-t-transparent' />
            ) : hasNextPage ? (
              <p className='h-5' ref={ref} />
            ) : (
              !selectMode &&
              example.map((ex, i) => (
                <Button
                  className='group relative -my-0.5 w-full justify-start gap-1 pl-1.5 font-normal transition-all duration-500'
                  key={i}
                  onClick={() => {
                    setData(ex.data)
                    updateFilter(ex.data)
                    setQuery(ex.query)
                    setSource(ex.source)
                    setFocusCollection(null)
                    play()
                    toast.success(
                      <p>
                        Fetch {data.length} {pluralize(rowSingular, data.length)} from{' '}
                        <span className='notranslate font-semibold'>{ex.query}</span>
                      </p>
                    )
                    toast.dismiss()
                  }}
                  variant='ghost'>
                  <Logo className='size-4' size={16} source={ex.source} />
                  <p className='notranslate'>{ex.query}</p>
                  <p className='absolute right-0 rounded-full px-2 py-0.5 text-xs text-muted-foreground/60 backdrop-blur transition-all duration-300 group-hover:opacity-0'>
                    Example
                  </p>
                </Button>
              ))
            )}
          </>
        ) : null}
      </ResizablePanel>

      <ResizableHandle className={leftPanelOpen ? 'mt-[62px] opacity-60' : 'hidden'} />

      <ResizablePanel
        className='flex h-screen flex-col justify-start bg-background'
        defaultSize={50}
        minSize={5}>
        <div
          className={cn(
            'flex justify-start gap-2 pt-0.5 *:h-7 *:text-sm *:font-normal',
            !leftPanelOpen && 'pl-6'
          )}>
          {collections ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      'gap-1.5 pl-3 pr-1.5',
                      !focusCollection && 'text-muted-foreground'
                    )}
                    size='sm'
                    variant='outline'>
                    {focusCollection ? (
                      <p className='notranslate'>{focusCollection.name}</p>
                    ) : (
                      <p>Collection</p>
                    )}
                    <CaretSortIcon className='size-4 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-[237px] p-0'>
                  <Command>
                    <CommandList>
                      {collections.length ? (
                        <>
                          <CommandInput placeholder='Search collections ...' />
                          <CommandEmpty>No collection found.</CommandEmpty>
                          <CommandGroup>
                            {collections.map(c => (
                              <CommandItem
                                className='notranslate'
                                key={c.id}
                                onSelect={() => {
                                  setFocusCollection(c)
                                  const _data = collect.filter(company =>
                                    c.items.includes(company.id)
                                  )
                                  setData(_data)
                                  updateFilter(_data)
                                }}
                                value={c.name}>
                                <CheckIcon
                                  className={cn(
                                    'mr-1.5 size-6 text-muted-foreground transition-all duration-300',
                                    focusCollection?.id === c.id ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                {c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      ) : null}
                    </CommandList>
                    {newCollectionMode ? (
                      <div className={cn('px-[5px] pb-[5px]', !collections.length && 'pt-[5px]')}>
                        <CreateCollection />
                      </div>
                    ) : (
                      <>
                        <hr />
                        <CommandItem className='m-1' onSelect={() => setNewCollectionMode(true)}>
                          <PlusCircledIcon className='mr-2 size-5' />
                          New collection
                        </CommandItem>
                      </>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
              <Popover onOpenChange={setAddCollectionOpen} open={addCollectionOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className={cn((!_table.getIsSomeRowsSelected() || focusCollection) && 'hidden')}
                    size='sm'
                    variant='outline'>
                    <p
                      className={
                        updateCollection.isPending
                          ? 'mr-1 size-4 animate-spin rounded-full border border-foreground border-t-transparent transition-all duration-500'
                          : 'size-0'
                      }
                    />
                    <PlusIcon className='mr-1' />
                    Add to Collection
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-[237px] p-0'>
                  <Command>
                    <CommandList>
                      {collections.length ? (
                        <>
                          <CommandInput placeholder='Search collections ...' />
                          <CommandEmpty>No collection found.</CommandEmpty>
                          <CommandGroup>
                            {collections.map(c => (
                              <CommandItem
                                className='notranslate'
                                key={c.id}
                                onSelect={() => {
                                  const checks = _table
                                      .getFilteredSelectedRowModel()
                                      .rows.map(r => r.original as Company),
                                    ids = checks.map(company => company.id)
                                  updateCollection.mutate({
                                    ...c,
                                    items: [...new Set(c.items.concat(ids))]
                                  })
                                  setCollect(uniqBy(collect.concat(checks), 'id'))
                                  setRowSelection({})
                                  setAddCollectionOpen(false)
                                }}>
                                {c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      ) : null}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {focusCollection ? (
                <Button
                  className={cn(
                    'transition-all duration-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-800 dark:hover:text-red-100',
                    !_table.getIsSomeRowsSelected() && !_table.getIsAllRowsSelected() && 'hidden'
                  )}
                  onClick={() => {
                    const checks = _table
                        .getFilteredSelectedRowModel()
                        .rows.map(r => r.original as Company),
                      ids = checks.map(company => company.id)
                    updateCollection.mutate({
                      ...focusCollection,
                      items: focusCollection.items.filter(i => !ids.includes(i))
                    })
                    setRowSelection({})
                    setData(_data => _data.filter(c => !ids.includes(c.id)))
                    updateFilter(data.filter(c => !ids.includes(c.id)))
                  }}
                  size='sm'
                  variant='outline'>
                  <p
                    className={
                      updateCollection.isPending
                        ? 'mr-1 size-4 animate-spin rounded-full border border-foreground border-t-transparent transition-all duration-500'
                        : 'size-0'
                    }
                  />
                  <TrashIcon className='mr-1' />
                  Delete
                </Button>
              ) : null}
            </>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild />
            <DropdownMenuContent />
          </DropdownMenu>
          <Button
            className='group hidden'
            disabled={!_table.getIsSomeRowsSelected()}
            size='sm'
            variant='ghost'>
            <CardStackIcon className='mr-1 block group-hover:hidden' />
            <CardStackPlusIcon className='mr-1 hidden group-hover:block' />
            Add to Collections
          </Button>
          <Button
            className='hidden *:transition-all *:duration-500'
            disabled={
              !_table.getIsSomeRowsSelected() ||
              _table.getFilteredSelectedRowModel().rows.some(c => (c.original as Company).unlocked)
            }
            onClick={async () => {
              const _ids = _table
                  .getFilteredSelectedRowModel()
                  .rows.map(c => (c.original as Company).id),
                employeeData = await runGetEmployees(
                  user.email ?? '',
                  encodeURIComponent(_ids.join(','))
                )
              if (employeeData) {
                setEmployees({ ...employees, ...employeeData } as Record<string, Employee[]>)
                toast.success(
                  `Employees at ${Object.keys(employeeData).length} companies unlocked successfully`
                )
              }
              toast.dismiss()
            }}
            size='sm'
            variant='ghost'>
            <PersonIcon className={employeesPending ? 'size-0' : 'mr-1 size-4'} />
            <p
              className={
                employeesPending
                  ? 'mr-1 size-4 animate-spin rounded-full border border-foreground border-t-transparent'
                  : 'size-0'
              }
            />
            Get Employees
          </Button>
          <Button
            className='group hidden'
            disabled={!_table.getIsSomeRowsSelected()}
            size='sm'
            variant='ghost'>
            <LinkedInLogoIcon className='mr-1 transition-all duration-300 group-hover:text-[#0077BB]' />
            Prospect on LinkedIn
          </Button>
          <Button
            className='hidden'
            onClick={() => saveAs(new Blob([jsonToCSV(data)]), `${query.replaceAll(' ', '-')}.csv`)}
            size='sm'
            variant='ghost'>
            <DownloadIcon className='mr-1' />
            Export CSV
          </Button>
        </div>
        {historyPending || searchPending ? (
          <div className='mx-1.5 mt-9 space-y-2.5 overflow-hidden'>
            {[...Array<number>(pagination.pageSize)].map((_, i) => (
              <Skeleton className='p-6' key={i} />
            ))}
          </div>
        ) : data.length ? (
          <Table>
            <TableHeader>
              {_table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      className='h-0 select-none p-0'
                      colSpan={header.colSpan}
                      key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {_table.getRowModel().rows.length ? (
                _table.getRowModel().rows.map(row => (
                  <Tutip
                    content={(row.original as Company).unlocked ? 'employee unlocked' : undefined}
                    key={row.id}
                    side='left'>
                    <TableRow
                      className={cn(
                        'group cursor-pointer transition-all duration-300 hover:bg-background hover:shadow-2xl hover:shadow-y-1.5 dark:hover:shadow-stone-500',
                        (row.original as Company).id === focus?.id &&
                          'bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600'
                      )}
                      data-state={row.getIsSelected() && 'selected'}
                      key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          className={cn(
                            'px-0 py-1 transition-all duration-300',
                            cell.column.id === 'name' && 'notranslate',
                            cell.column.id !== 'select' && 'group-hover:-translate-x-1'
                          )}
                          key={cell.id}
                          onClick={() => {
                            if (cell.column.id === 'select') {
                              return
                            }
                            const { id } = row.original as Company,
                              open = Boolean(focus && focus.id === id)
                            setFocus(
                              open
                                ? null
                                : data.find((c: Company) => c.id === id) ?? ({} as Company)
                            )
                            setColumnVisibility({ ...columnVisibility, description: open })
                          }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Tutip>
                ))
              ) : (
                <TableCell className='h-[calc(100vh-4.1rem)] text-center' colSpan={columns.length}>
                  No results.
                </TableCell>
              )}
            </TableBody>
          </Table>
        ) : null}
        <Pagination rowSingular={rowSingular} table={_table} />
      </ResizablePanel>
      <ResizableHandle className='mt-[62px] opacity-60' />
      <ResizablePanel
        className={focus ? 'relative flex h-screen flex-col !overflow-y-auto' : 'hidden'}
        defaultSize={30}
        maxSize={45}
        minSize={25}>
        <Cross2Icon
          className='fixed right-1.5 top-1.5 z-10 size-6 rounded-md border bg-background p-1 text-red-300 drop-shadow-md transition-all duration-500 hover:size-7 hover:bg-red-500 hover:text-white dark:text-red-600 dark:hover:text-white'
          onClick={() => {
            setFocus(null)
            setColumnVisibility({ ...columnVisibility, description: true })
          }}
        />
        <Banner company={focus ?? ({ id: '' } as Company)} />
        <Info company={focus ?? ({} as Company)} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
