'use client'

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { useCallback, useEffect, useState, useTransition } from 'react'
import {
  CalendarIcon,
  ChevronDownIcon,
  Cross2Icon,
  GearIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  PaperPlaneIcon,
  Pencil1Icon,
  TrashIcon,
  UpdateIcon,
  UploadIcon
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
import { AnimatePresence } from 'framer-motion'
import pluralize from 'pluralize'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import useSound from 'use-sound'
import { useIsClient, useLocalStorage } from 'usehooks-ts'
import { z } from 'zod'

import { cn } from '@a/ui'
import { Badge } from '@a/ui/badge'
import { Button } from '@a/ui/button'
import { Calendar } from '@a/ui/calendar'
import { Checkbox } from '@a/ui/checkbox'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@a/ui/command'
import { Dialog, DialogClose, DialogTrigger } from '@a/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@a/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@a/ui/form'
import { Input } from '@a/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@a/ui/resizable'
import { ScrollArea } from '@a/ui/scroll-area'
import { Skeleton } from '@a/ui/skeleton'
import { Slider } from '@a/ui/slider'
import { TableCell, TableHead, TableRow } from '@a/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@a/ui/tabs'

import type { Company, Query, Setting, Source } from '~/types'
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
import { FileUploader } from '~/components/upload'
import { useServerAction } from '~/hook/server-action'
import { useForm } from '~/hook/use-form'
import { DataTableFacetedFilter } from '~/table/faceted-filter'
import { DataTableFacetedFilterContainArray } from '~/table/faceted-filter-array'
import { DataTablePagination } from '~/table/pagination'
import { DataTableViewOptions } from '~/table/view-options'
import { capitalize } from '~/utils'
import { deleteHistory, file2keyword, getCompanies, getHistory, url2keyword } from './actions'
import FillInput from './fill-input'
import Logo from './logo'
import Profile from './profile'

const models = ['gpt-3.5-turbo-0125', 'gpt-4-0125-preview']
const descriptions: Record<Source, string> = {
  linkedin: 'A social network for businesses to connect.',
  kompass: 'A global business directory for B2B companies.',
  europages: 'A B2B platform for suppliers and manufacturers.'
}
const defaultSetting: Setting = {
  source: 'linkedin',
  model: 'gpt-3.5-turbo-0125',
  alpha: 4,
  beta: 5
}

const rowString = 'company'
const calendarSize = 3

const filterText: string[] = ['description']
const filterExact: string[] = ['industry', 'country']
const filterArrayContain: string[] = ['searchQueries']

const employeeColName = 'employeeCount'

const step = 100
const threshold: number = step * 10
const clipped: number = threshold + step

const estimate = (s: Setting) => 3 * s.alpha * (s.beta + 1)

export default function MyTable({ user, history }: { user: string; history: Query[] }) {
  function Upload() {
    const form = useForm({
      schema: z.object({ files: z.array(z.instanceof(File)).min(1) }),
      defaultValues: { files: [] }
    })
    return (
      <Form {...form}>
        <form
          id='upload'
          onSubmit={form.handleSubmit(data => {
            const formData = new FormData()
            data.files.forEach(f => formData.append('files', f))
            file2keywordTransition(() => fromFileAction(formData))
          })}>
          <FormField
            control={form.control}
            name='files'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={5}
                    maxSize={25 * 1024 * 1024}
                    accept={{
                      'image/*': [],
                      'application/pdf': [],
                      'application/msword': [],
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                      'application/vnd.ms-excel': [],
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                      'application/vnd.ms-powerpoint': [],
                      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        []
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }

  function FromWebsite() {
    const form = useForm({ schema: z.object({ url: z.string().url() }) })
    return (
      <Form {...form}>
        <form
          id='from-website'
          onSubmit={form.handleSubmit(data =>
            url2keywordTransition(() => fromWebsiteAction(data))
          )}>
          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative'>
                    <GlobeIcon className='absolute left-2 top-2 size-5 text-muted-foreground' />
                    <Input {...field} className='pl-8' placeholder='https://' />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }

  function Search() {
    const searchForm = useForm({
      schema: z.object({
        query: z.string().min(4, { message: 'Query must be at least 4 characters.' }),
        setting: z.object({
          source: z.enum(['linkedin', 'kompass', 'europages']),
          model: z.string(),
          alpha: z.number(),
          beta: z.number()
        }),
        user: z.string()
      }),
      defaultValues: { query: '', setting: s, user }
    })
    return (
      <>
        {!searchForm.getValues().query && (
          <Loop
            texts={examples}
            className='pointer-events-none absolute left-8 top-2 w-[calc(100%-2rem)] truncate pr-px text-sm text-muted-foreground'
          />
        )}
        <Form {...searchForm}>
          <form
            id='search'
            onSubmit={searchForm.handleSubmit(data => {
              searchTransition(() => searchAction(data))
              toast.loading(`Searching will take about ${estimate(s)} seconds...`, {
                description: `Fetching companies with query: ${data.query}`
              })
            })}>
            <FormField
              control={searchForm.control}
              name='query'
              render={({ field }) => (
                <FormItem
                  className={cn(
                    'notranslate transition-all duration-300',
                    !searchPending && searchForm.getValues().query && 'mr-10'
                  )}>
                  <FormControl>
                    <NiceInput
                      id='search-input'
                      className={cn(
                        'h-8 pl-8 pr-px focus-visible:ring-orange-300 dark:focus-visible:ring-orange-600'
                      )}
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
          disabled={searchPending}
          type='submit'
          form='search'
          variant='outline'
          size='icon'
          className={cn(
            'group absolute right-0 top-0 z-10 size-[2.12rem] overflow-hidden transition-all duration-300 hover:scale-110',
            (!searchForm.getValues().query || searchPending) && '-right-7 scale-0'
          )}>
          <span className='absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#fedcba_50%,#ffffff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#654321_50%,#000000_100%)]' />
          <PaperPlaneIcon className='mb-1 ml-2 mr-1 size-5 -rotate-45 opacity-80 transition-all duration-300 group-hover:scale-110' />
        </Button>
      </>
    )
  }

  const examples = history.filter((q: Query) => !q.date).map((q: Query) => q.query)
  examples.unshift('Enter keywords ...')

  const [s, setSetting] = useLocalStorage<Setting>('setting', defaultSetting)

  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [data, _setData] = useState<Company[]>([])

  const [play] = useSound('ding.mp3')

  const [runGetHistory, historyPending] = useServerAction(getHistory)
  const [runDeleteHistory, deletePending] = useServerAction(deleteHistory)

  const [searchPending, searchTransition] = useTransition()
  const [newData, searchAction] = useFormState(
    getCompanies as (
      state: Company[],
      payload: {
        setting: Setting
        user: string
        query: string
      }
    ) => Promise<Company[]>,
    []
  )
  const [url2keywordPending, url2keywordTransition] = useTransition()
  const [fromWebsite, fromWebsiteAction] = useFormState(
    url2keyword as (state: string[], payload: { url: string }) => Promise<string[]>,
    []
  )
  const [file2keywordPending, file2keywordTransition] = useTransition()
  const [fromFile, fromFileAction] = useFormState(
    file2keyword as (state: string[], payload: FormData) => Promise<string[]>,
    []
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    searchQueries: false
  })
  const [pagination, setPagination] = useState({ pageSize: 20, pageIndex: 0 })
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, columnVisibility, pagination, rowSelection, sorting },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })
  const isFiltered: boolean = table.getState().columnFilters.length > 0

  const getUniqueFromColumn = useCallback(
    (column: string) =>
      Array.from(
        (table.getColumn(column)?.getFacetedUniqueValues() as Map<string, number>).entries()
      )
        .sort((a, b) => b[1] - a[1])
        .map(([key, _]) => key)
        .flat()
        .filter((v, i, a) => a.indexOf(v) === i)
        .filter(Boolean),
    [table]
  )

  const [company, setCompany] = useState<Company | null>(null)

  const employeeCol = table.getColumn(employeeColName)

  const realMax = Math.max(...getUniqueFromColumn(employeeColName).map(Number))
  const [min, max] = [0, realMax < clipped ? realMax : clipped]
  const [minMax, setMinMax] = useState<[number, number]>([min, max])

  function handleSlide([newMin, newMax]: [number, number]) {
    newMax = newMax === clipped ? realMax : newMax
    employeeCol?.setFilterValue([newMin, newMax])
    if (newMin === min && newMax === realMax) {
      employeeCol?.setFilterValue(undefined)
    }
    setMinMax([newMin, newMax])
  }
  const [currentMin, currentMax] = minMax

  const [filterOpen, setFilterOpen] = useState(true)
  const [filterOpenPrevious, setFilterOpenPrevious] = useState(true)

  const [currentHistory, setCurrentHistory] = useState<Query[]>(history)
  const [selectMode, setSelectMode] = useState(false)
  const [selection, setSelection] = useState<string[]>([])

  const setData = useCallback((data: Company[]) => {
    _setData(data)
    setColumnVisibility(
      data.every((c: Company) => c.employeeCount && c.industry)
        ? columnVisibility
        : { ...columnVisibility, employeeCount: false, industry: false }
    )
  }, [])

  const [hover, setHover] = useState<number | null>(null)

  const isClient = useIsClient()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem(rowString)
      if (storedData) {
        setData(JSON.parse(storedData) as Company[])
        const realMax = Math.max(...getUniqueFromColumn(employeeColName).map(Number))
        setMinMax([0, realMax < clipped ? realMax : clipped])
      }
    }
    if (newData.length > 0) {
      play()
      localStorage.setItem(rowString, JSON.stringify(newData))
      toast.success('Fetch successfully', {
        description: `Found ${newData.length} ${pluralize(rowString, newData.length)}`
      })
      toast.dismiss()
      setData(newData)
    }
  }, [getUniqueFromColumn, newData, play, setData])

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel
        defaultSize={14}
        minSize={5}
        maxSize={14}
        className='relative flex h-screen select-none flex-col'>
        <DropdownMenu>
          {isClient && (
            <DropdownMenuTrigger className='notranslate mx-auto mb-0.5 mt-1 flex items-center gap-2 rounded-full px-4 py-1.5 capitalize transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted hover:drop-shadow-md focus:outline-none'>
              <Logo source={s.source} size={20} />
              {s.source}
              <ChevronDownIcon className='-ml-0.5 mb-px size-4' />
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent className='notranslate m-1.5 rounded-2xl transition-all duration-300 hover:drop-shadow-xl'>
            <DropdownMenuRadioGroup
              value={s.source}
              onValueChange={value => setSetting({ ...s, source: value as Source })}>
              {Object.keys(descriptions).map((source, i) => (
                <DropdownMenuRadioItemCheck
                  value={source}
                  key={source}
                  className='w-96 gap-2 pr-5'
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}>
                  <AnimatePresence>
                    {hover === i && (
                      <Hover className='absolute -z-10 size-full rounded-2xl bg-muted' />
                    )}
                  </AnimatePresence>
                  <div
                    className={cn(
                      'flex items-center gap-6 py-3 pl-6',
                      s.source === source ? 'pr-6' : 'pr-12'
                    )}>
                    <Logo source={source as Source} size={32} />
                    <div className='flex flex-col gap-0.5'>
                      <p className='text-xl font-medium capitalize tracking-tight'>{source}</p>
                      <p className='text-pretty leading-5 text-muted-foreground'>
                        {descriptions[source as Source]}
                      </p>
                    </div>
                  </div>
                </DropdownMenuRadioItemCheck>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='group absolute right-1 top-1 size-1 opacity-[0.01] transition-all duration-1000 hover:size-8 hover:scale-110 hover:opacity-100 hover:drop-shadow-lg'>
              <GearIcon className='size-6 transition-all duration-1000 group-hover:rotate-180' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='notranslate group mx-2 my-1 transition-all duration-300 hover:drop-shadow-xl'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-full justify-evenly'>
                  <p className='opacity-50'>Model</p>
                  <p className='transition-all duration-500 group-hover:scale-110'>{s.model}</p>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top'>
                <DropdownMenuRadioGroup
                  value={s.model}
                  onValueChange={value => setSetting({ ...s, model: value })}>
                  {models.map((model, i) => (
                    <DropdownMenuRadioItem key={i} value={model}>
                      {model}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className='mx-2 mt-6 flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <p className='text-base font-medium'>α</p>
                <p className='text-xs opacity-50'>Alpha</p>
              </div>
              {s.alpha}
            </div>
            <Slider
              className='mx-auto my-1 w-11/12 transition-all duration-500 group-hover:scale-105'
              max={30}
              min={2}
              defaultValue={[s.alpha]}
              step={1}
              onValueChange={value => setSetting({ ...s, alpha: value[0] ?? 4 })}
            />
            <div className='mx-2 mt-6 flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <p className='text-base font-medium'>β</p>
                <p className='text-xs opacity-50'>Beta</p>
              </div>
              {s.beta}
            </div>
            <Slider
              className='mx-auto my-1 w-11/12 transition-all duration-500 group-hover:scale-105'
              max={30}
              min={2}
              defaultValue={[s.beta]}
              step={1}
              onValueChange={value => setSetting({ ...s, beta: value[0] ?? 5 })}
            />
          </PopoverContent>
        </Popover>
        {searchPending && <FakeProgress estimate={estimate(s)} />}
        <div className='group relative mx-1.5 transition-all duration-300 hover:drop-shadow-lg'>
          <div className='absolute left-1.5 mt-1 items-center transition-all duration-200 group-hover:scale-125'>
            {searchPending ? (
              <UpdateIcon className='mt-0.5 size-5 animate-spin opacity-70 duration-700' />
            ) : (
              <MagnifyingGlassIcon className='-ml-px size-6 opacity-30' />
            )}
          </div>
          <Search />
          <Popover>
            <Tutip content='Generate Keywords with AI' side='left'>
              <PopoverTrigger asChild>
                <Button
                  className='group absolute right-1 top-[3px] size-7 transition-all duration-300 hover:bg-stone-200 dark:hover:bg-stone-600'
                  variant='ghost'
                  size='icon'>
                  <UploadIcon className='size-4 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-foreground' />
                </Button>
              </PopoverTrigger>
            </Tutip>
            <PopoverContent className='m-1 w-[400px] p-3 drop-shadow-lg transition-all duration-300 hover:shadow-xl hover:drop-shadow-2xl'>
              <Tabs defaultValue='files'>
                <TabsList className='mb-1.5 w-full'>
                  <TabsTrigger className='w-full' value='files'>
                    Files
                  </TabsTrigger>
                  <TabsTrigger className='notranslate w-full' value='website'>
                    Website
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='files'>
                  <Upload />
                  <Button
                    type='submit'
                    form='upload'
                    className='mt-3.5 w-full'
                    disabled={file2keywordPending}>
                    Generate Keywords with AI
                    <UpdateIcon className={file2keywordPending ? 'ml-2 animate-spin' : 'hidden'} />
                  </Button>
                  <FillInput list={fromFile} inputId='search-input' />
                </TabsContent>
                <TabsContent value='website'>
                  <FromWebsite />
                  <Button
                    type='submit'
                    form='from-website'
                    className='mt-3.5 w-full'
                    disabled={url2keywordPending}>
                    Generate Keywords with AI
                    <UpdateIcon className={url2keywordPending ? 'ml-2 animate-spin' : 'hidden'} />
                  </Button>
                  <FillInput list={fromWebsite} inputId='search-input' />
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>

        <div className={data.length ? 'flex flex-col px-px' : 'hidden'}>
          <div
            className={cn(
              'relative flex items-center transition-all duration-300',
              filterOpen ? 'mt-px' : 'my-2 hover:-translate-y-0.5 hover:drop-shadow-md'
            )}>
            <Button
              variant={filterOpen ? 'ghost' : 'outline'}
              className={cn(
                'group mx-1.5 h-8 grow p-0 transition-all duration-300 hover:opacity-100',
                isFiltered && 'mr-[4.5rem]',
                !filterOpen && 'opacity-70'
              )}
              onClick={() => setFilterOpen(!filterOpen)}>
              <p className='transition-all duration-300 group-hover:text-lg group-hover:tracking-normal'>
                Filter
              </p>
            </Button>
            <Button
              size='sm'
              className={cn(
                'absolute right-1.5 ml-1 h-6 border-red-400 pl-2 pr-1 text-red-500 drop-shadow-md transition-all duration-300 hover:bg-red-400 hover:text-background',
                !isFiltered && 'scale-0'
              )}
              variant='outline'
              onClick={() => {
                table.resetColumnFilters()
                setMinMax([min, max])
              }}>
              Reset
              <Cross2Icon className='ml-1 mt-px size-3' />
            </Button>
          </div>
          <div
            className={cn(
              'mx-1 flex flex-col gap-1.5 transition-all duration-500',
              !filterOpen && '-my-32 translate-y-1/3 scale-0 opacity-0'
            )}>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='justify-start px-3 font-normal'>
                  {company ? (
                    <p className='notranslate truncate'>{company.name}</p>
                  ) : (
                    <p>Company</p>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='p-0 transition-all duration-300 hover:drop-shadow-xl'
                side='right'>
                <Command>
                  <CommandInput placeholder='Company name' />
                  <CommandEmpty>No companies found.</CommandEmpty>
                  <CommandList className='m-1'>
                    {[...data]
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((company, i) => (
                        <CommandItem
                          key={i}
                          className='notranslate'
                          onSelect={() => {
                            setCompany(company)
                            table.getColumn('name')?.setFilterValue(company.name)
                            setColumnVisibility({
                              ...columnVisibility,
                              description: false
                            })
                          }}>
                          {company.name}
                        </CommandItem>
                      ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {filterExact.map((c, i) => (
              <DataTableFacetedFilter
                key={i}
                column={table.getColumn(c)}
                title={c}
                options={getUniqueFromColumn(c)}
                showBadge={filterOpen}
              />
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='justify-start px-3 font-normal'>
                  Employee Range
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='p-0 transition-all duration-300 hover:drop-shadow-xl'
                side='right'>
                <div className='mx-3 mt-2 flex justify-between px-px'>
                  <p>
                    {currentMin < step ? 'Under ' + step : currentMin <= threshold && currentMin}
                  </p>
                  <p>
                    {currentMax > threshold ? threshold + '+' : currentMax >= step && currentMax}
                  </p>
                </div>
                <Slider2
                  className='mx-auto my-3 w-11/12'
                  min={min}
                  max={max}
                  step={step}
                  value={minMax}
                  onValueChange={handleSlide}
                  minStepsBetweenThumbs={0}
                />
                <div
                  className={cn(
                    'm-1 transition-all duration-300',
                    currentMin < step &&
                      (currentMax === realMax || currentMax > threshold) &&
                      '-my-3.5 scale-0 opacity-0'
                  )}>
                  <Button
                    variant='ghost'
                    onClick={() => {
                      setMinMax([min, max])
                      employeeCol?.setFilterValue(undefined)
                    }}
                    className='h-9 w-full text-sm font-normal'>
                    Clear range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {filterArrayContain.map((c, i) => (
              <DataTableFacetedFilterContainArray
                key={i}
                column={table.getColumn(c)}
                title={c}
                options={getUniqueFromColumn(c)}
                showBadge={filterOpen}
              />
            ))}
            {filterText.map((c, i) => (
              <Input
                key={i}
                placeholder={capitalize(c)}
                value={table.getColumn(c)?.getFilterValue() as string}
                onChange={event => table.getColumn(c)?.setFilterValue(event.target.value)}
              />
            ))}
            <DataTableViewOptions table={table} className='hidden' />
          </div>
        </div>

        <div className='mb-1 ml-1 mr-1.5 mt-1.5 flex items-center justify-between text-sm'>
          <div className='flex items-center gap-1'>
            <Checkbox
              checked={selection.length === currentHistory.length}
              onCheckedChange={checked =>
                checked ? setSelection(currentHistory.map(q => q.id)) : setSelection([])
              }
              className={cn('opacity-0', selectMode ? 'opacity-100' : 'cursor-default')}
            />
            {selection.length > 0 && (
              <p className='ml-px size-5 rounded bg-muted px-0.5 text-center text-sm'>
                {selection.length}
              </p>
            )}
          </div>
          <p className='notranslate'>
            {date?.from ? (
              date.to ? (
                <p className='whitespace-pre text-center text-xs leading-none'>
                  {format(date.from, 'd/L/y') + '\n' + format(date.to, 'd/L/y')}
                </p>
              ) : (
                format(date.from, 'd/L/y')
              )
            ) : (
              'History'
            )}
          </p>
          <div className='flex items-center gap-1'>
            <Dialog>
              <Tutip content='Delete' side='top'>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className={
                      selection.length
                        ? 'size-5 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-800 dark:hover:text-red-100'
                        : 'hidden'
                    }>
                    <TrashIcon className='size-4' />
                  </Button>
                </DialogTrigger>
              </Tutip>
              <DialogContent className='w-fit p-4'>
                {'Are you sure you want to delete ' +
                  selection.length +
                  ' ' +
                  pluralize('query', selection.length) +
                  '?'}
                <div className='flex justify-end gap-3'>
                  <DialogClose asChild>
                    <Button variant='secondary'>Cancel</Button>
                  </DialogClose>
                  <Button
                    variant='destructive'
                    onClick={async () => {
                      await runDeleteHistory(user, selection)
                      window.location.reload()
                    }}>
                    Delete
                    {deletePending && <UpdateIcon className='ml-2 animate-spin' />}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Tutip content='Select' side='top'>
              <Button
                variant={selectMode ? 'default' : 'outline'}
                size='icon'
                className='size-5 shadow-none transition-all duration-500'
                onClick={() => {
                  setSelection([])
                  setSelectMode(!selectMode)
                }}>
                <Pencil1Icon className='size-4' />
              </Button>
            </Tutip>
          </div>
        </div>

        <ScrollArea className='grow'>
          {currentHistory.map((query, i) => (
            <Button
              key={i}
              variant='ghost'
              className='group relative -mb-2 w-full font-normal'
              size='sm'
              onClick={async () => {
                if (selectMode) {
                  setSelection(
                    selection.includes(query.id)
                      ? selection.filter(s => s !== query.id)
                      : [...selection, query.id]
                  )
                } else {
                  const data = (await runGetHistory(user, query.id)) as Company[]
                  setData(data)
                  toast.success('Fetch successfully', {
                    description: `${data.length} ${pluralize(rowString, data.length)}`
                  })
                  toast.dismiss()
                  play()
                  localStorage.setItem('company', JSON.stringify(data))
                }
              }}>
              <div className='absolute left-1 flex items-center gap-1'>
                {selectMode ? (
                  <Checkbox checked={selection.includes(query.id)} />
                ) : (
                  <Logo source={query.source} size={16} />
                )}
                <p className='notranslate pt-px'>{query.query}</p>
              </div>
              <div className={selectMode ? 'hidden' : 'absolute right-0 flex'}>
                <p className='w-8 bg-gradient-to-l from-background group-hover:from-accent' />
                <div className='bg-background pl-1 pr-2.5 group-hover:bg-accent'>
                  {query.date ? (
                    <div className='opacity-35'>
                      <p className='group-hover:hidden'>{format(query.date, 'LLL d')}</p>
                      <p className='hidden group-hover:block'>
                        {formatDistance(query.date, new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  ) : (
                    <Badge className='font-normal' variant='secondary'>
                      Example
                    </Badge>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </ScrollArea>

        <div className='relative px-1.5 pb-1.5'>
          <MagnifyingGlassIcon className='absolute left-2.5 mt-1 size-5' />
          <Popover
            onOpenChange={() => {
              setFilterOpenPrevious(!filterOpen)
              setFilterOpen(!filterOpenPrevious)
            }}>
            <Tutip content='Browse by date' side='right'>
              <PopoverTrigger asChild>
                <Button className='absolute right-1.5 size-7' variant='ghost' size='icon'>
                  <CalendarIcon className='mb-px size-[1.1rem]' />
                </Button>
              </PopoverTrigger>
            </Tutip>
            <PopoverContent
              className='notranslate w-full p-0 transition-all duration-300 hover:drop-shadow-xl'
              side='right'>
              <Calendar
                initialFocus
                mode='range'
                numberOfMonths={calendarSize}
                defaultMonth={new Date(Date.now() - 30 * 86400000 * (calendarSize - 1))}
                selected={date}
                onSelect={r => {
                  r = r && r.from?.getTime() === r.to?.getTime() ? undefined : r
                  setDate(r)
                  setCurrentHistory(
                    history.filter((q: Query) =>
                      r && r.from instanceof Date && q.date
                        ? r.from <= q.date &&
                          q.date <= new Date((r.to ?? r.from).getTime() + 86399999)
                        : true
                    )
                  )
                }}
              />
            </PopoverContent>
          </Popover>
          <Input
            onChange={e => {
              const query = e.target.value
              setDate(undefined)
              setCurrentHistory(
                history.filter((q: Query) => q.query.toLowerCase().includes(query.toLowerCase()))
              )
            }}
            className='h-7 pl-6'
            placeholder='History search'
          />
        </div>
      </ResizablePanel>

      <ResizableHandle className='opacity-35' />

      <ResizablePanel
        minSize={5}
        defaultSize={50}
        className='flex h-screen flex-col justify-between'>
        {historyPending || searchPending ? (
          <div className='mx-1.5 mt-9 space-y-2.5 overflow-hidden'>
            {[...Array<number>(pagination.pageSize)].map((_, i) => (
              <Skeleton key={i} className='p-6' />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead
                        className='h-0 select-none p-0'
                        key={header.id}
                        colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {data.length > 0 && (
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      className='group cursor-pointer transition-all duration-300 hover:bg-background hover:shadow-2xl hover:shadow-y-1.5 dark:hover:shadow-stone-500'
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'px-0 py-1 transition-all duration-300',
                            cell.column.id === 'name' && 'notranslate',
                            cell.column.id !== 'select' && 'group-hover:-translate-x-1'
                          )}
                          onClick={() => {
                            if (cell.column.id === 'select') {
                              return
                            }
                            const { id } = row.original as Company
                            const open = !!(company && company.id === id)
                            setCompany(
                              open
                                ? null
                                : data.find((c: Company) => c.id === id) ?? ({} as Company)
                            )
                            setColumnVisibility({
                              ...columnVisibility,
                              description: open
                            })
                          }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableCell colSpan={columns.length} className='h-[calc(85vh)] text-center'>
                    No results.
                  </TableCell>
                )}
              </TableBody>
            )}
          </Table>
        )}
        <DataTablePagination table={table} rowString={rowString} />
      </ResizablePanel>
      <ResizableHandle className='opacity-35' />
      <ResizablePanel
        minSize={25}
        defaultSize={30}
        maxSize={45}
        className={!company ? 'hidden' : 'flex h-screen flex-col'}>
        <div className='absolute right-0 z-10'>
          <Button
            className='group m-1 size-8 p-0 transition-all duration-200 hover:scale-110'
            variant='outline'
            onClick={() => {
              setCompany(null)
              setColumnVisibility({ ...columnVisibility, description: true })
            }}>
            <Cross2Icon className='size-4 transition-all duration-200 group-hover:scale-125' />
          </Button>
        </div>
        <Profile user={user} company={company ?? ({} as Company)} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
