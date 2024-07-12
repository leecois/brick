import type { SortingState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import TrafficLight from '@arvinxu/macos-traffic-light'
import {
  DashboardIcon,
  EnterIcon,
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  ListBulletIcon,
  LockClosedIcon,
  LockOpen1Icon,
  PersonIcon
} from '@radix-ui/react-icons'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import confetti from 'canvas-confetti'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import ReactShowMoreText from 'react-show-more-text'
import { toast } from 'sonner'

import type { UserModel } from '@a/db/schema'
import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'
import { Sheet, SheetContent, SheetTrigger } from '@a/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@a/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@a/ui/tabs'

import type { Company, Employee } from '~/types'
import { genMail, getCompanyInfo, getContact, getEmployees } from '~/actions'
import columns from '~/column/employee'
import { ScrollArea } from '~/components/scroll-area'
import { Textarea } from '~/components/textarea'
import Tutip from '~/components/tutip'
import useServerAction from '~/hook/server-action'
import { employeesAtom, infoAtom } from '~/store'
import Pagination from '~/table/pagination'
import Avatar from './avatar'
import Contact from './contact'
import More from './more'

const fireworksConfig = {
    colors: ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'],
    particleCount: 5,
    spread: 50,
    startVelocity: 100
  },
  needed = ['location', 'industry', 'mail', 'phone', 'work', 'verified']

export default function Info({ company }: { readonly company: Company }) {
  const _user = useSession().data?.user as UserModel,
    [edit, setEdit] = useState(''),
    [employees, setEmployees] = useAtom(employeesAtom),
    [focusEmployee, setFocusEmployee] = useState<Employee | null>(null),
    [info, setInfo] = useAtom(infoAtom),
    [maximized, setMaximized] = useState(false),
    [noEdit, setNoEdit] = useState(''),
    [notes, setNotes] = useState(''),
    [open, setOpen] = useState(false),
    [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 }),
    [runGenMail, genMailPending] = useServerAction(genMail),
    [runGetCompanyInfo, companyInfoPending] = useServerAction(getCompanyInfo),
    [runGetContact, contactPending] = useServerAction(getContact),
    [runGetEmployees, employeesPending] = useServerAction(getEmployees),
    [sorting, setSorting] = useState<SortingState>([]),
    { description, id, industry, name } = company,
    fireworks = () => {
      const end = Date.now() + 1500,
        frame = () => {
          if (Date.now() > end) {
            return
          }
          void confetti({ angle: 60, origin: { x: 0, y: 1 }, ...fireworksConfig })
          void confetti({ angle: 120, origin: { x: 1, y: 1 }, ...fireworksConfig })
          requestAnimationFrame(frame)
        }
      frame()
    },
    table = useReactTable({
      columns,
      data: employees[id] ?? [],
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      state: { pagination, sorting }
    })

  useEffect(() => {
    setFocusEmployee(null)
    setOpen(false)
  }, [id])

  return (
    <>
      <Popover open={open}>
        <PopoverTrigger className='fixed bottom-0 right-0' />
        <PopoverContent
          className={cn(
            'notranslate relative z-[1002] pb-0 pl-2.5 pr-px pt-2.5 transition-all duration-500',
            noEdit ? 'size-[800px]' : 'h-[361px] w-[555px]',
            maximized
              ? 'ml-10 h-screen w-[calc(100vw-2.7rem)] rounded-none border-none shadow-none'
              : 'mb-3 mr-2 max-h-[calc(100vh-1.5rem)] rounded-lg hover:shadow-xl hover:drop-shadow-xl'
          )}
          side='right'>
          <TrafficLight
            onClose={() => setOpen(false)}
            onMaximize={() => setMaximized(!maximized)}
            onMinimize={() => setOpen(false)}
          />
          <p className='absolute left-1/2 top-1 -translate-x-1/2 font-medium'>Write with AI</p>
          <ScrollArea
            className={cn(
              'mt-2 rounded-lg pr-2.5',
              maximized ? 'h-[calc(100vh-2.5rem)]' : 'h-[758px] max-h-[calc(100vh-3.6rem)]'
            )}>
            <div className='mt-2 flex flex-col px-px'>
              <p className='mx-auto my-1'>From</p>
              <div className='flex flex-col rounded-xl bg-muted p-3 *:flex *:justify-between'>
                <div>
                  <p>{_user.company}</p>
                  <p>{_user.industries?.join(', ')}</p>
                </div>
                <div className='text-xs text-muted-foreground'>
                  <p>{_user.name}</p>
                  <p>{_user.job}</p>
                </div>
              </div>
              <p className='mx-auto my-1'>To</p>
              <div className='flex flex-col rounded-xl bg-muted p-3 *:flex *:justify-between'>
                <div>
                  <p>{name}</p>
                  <p className='text-right'>{industry}</p>
                </div>
                <div className='text-xs text-muted-foreground'>
                  <p>{focusEmployee?.name}&nbsp;</p>
                  <p>{focusEmployee?.title}</p>
                </div>
              </div>
              <Textarea
                className='my-3'
                onChangeCapture={e => setNotes(e.currentTarget.value)}
                placeholder='Notes'
              />
              <Button
                onClick={async () => {
                  const mail = await runGenMail({
                    company: id,
                    employee: focusEmployee?.id,
                    notes,
                    user: _user.id
                  })
                  if (mail) {
                    setNoEdit(mail.en)
                    setEdit(mail.vi)
                    toast.success('Mail generated successfully')
                  } else {
                    toast.error('Mail generation failed')
                  }
                  toast.dismiss()
                }}>
                Generate Email
                <p
                  className={cn(
                    'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
                    genMailPending && 'size-5 border'
                  )}
                />
              </Button>
              {noEdit ? (
                <div className='notranslate mt-3 grid grid-cols-2 gap-3 px-0.5'>
                  <p className='whitespace-pre-line text-sm text-foreground/70'>{noEdit}</p>
                  <Textarea onChange={e => setEdit(e.currentTarget.value)} value={edit} />
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <div className='mx-3 flex justify-between gap-2'>
        <p className='notranslate flex flex-wrap text-balance text-2xl font-semibold'>{name}</p>
        <Button onClick={() => setOpen(true)} variant='outline'>
          <EnvelopeClosedIcon className='mr-1 size-4' />
          Send Email
        </Button>
      </div>
      <ReactShowMoreText className='pl-3 text-muted-foreground' keepNewLines={false} lines={5}>
        {description}
      </ReactShowMoreText>
      <Tabs defaultValue='info'>
        <div className='mt-2 flex'>
          <TabsList className='mx-auto'>
            <TabsTrigger
              className={cn(
                !info[id] &&
                  'data-[state=active]:bg-muted data-[state=active]:text-muted-foreground data-[state=active]:shadow-none',
                'transition-all duration-300 *:transition-all *:duration-500 hover:bg-background'
              )}
              onClick={async () => {
                if (info[id]) {
                  return
                }
                const _info = await runGetCompanyInfo(_user.email, id)
                if (_info) {
                  setInfo({ ...info, [id]: _info })
                  fireworks()
                  toast.success('Info generated successfully')
                } else {
                  toast.error('Info generated failed')
                }
                toast.dismiss()
              }}
              value='info'>
              <InfoCircledIcon className={companyInfoPending ? 'size-0' : 'mr-1 size-4'} />
              <p
                className={
                  companyInfoPending
                    ? 'mr-1 size-4 animate-spin rounded-full border border-foreground border-t-transparent'
                    : 'size-0'
                }
              />
              More Info
            </TabsTrigger>
            <p className='mx-1 h-6 w-[0.5px] rounded-full bg-muted-foreground/50' />
            <TabsTrigger
              className='transition-all duration-300 *:transition-all *:duration-500 hover:bg-background'
              onClick={async () => {
                if (employees[id]) {
                  return
                }
                const employeeData = await runGetEmployees(_user.email, encodeURIComponent(id))
                if (employeeData) {
                  setEmployees({ ...employees, ...employeeData })
                  toast.success(`Employees at ${name} unlocked successfully`)
                } else {
                  toast.error(`Employees not available at ${name}`)
                }
                toast.dismiss()
              }}
              value='employee'>
              <PersonIcon className={employeesPending ? 'size-0' : 'mr-1 size-4'} />
              <p
                className={
                  employeesPending
                    ? 'mr-1 size-4 animate-spin rounded-full border border-foreground border-t-transparent'
                    : 'size-0'
                }
              />
              Employees
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='info'>{info[id] ? <More more={info[id]} /> : null}</TabsContent>
        <TabsContent value='employee'>
          {employees[id] ? (
            <Tabs defaultValue='table'>
              <div className='flex justify-end pr-1.5'>
                <TabsList className='z-10 h-7 px-0.5'>
                  <TabsTrigger className='px-1' value='table'>
                    <Tutip content='Table view' side='top'>
                      <ListBulletIcon />
                    </Tutip>
                  </TabsTrigger>
                  <TabsTrigger className='px-1' value='grid'>
                    <Tutip content='Grid view' side='top'>
                      <DashboardIcon />
                    </Tutip>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent className='-mt-7' value='table'>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <TableHead
                            className='h-8 py-0 pr-0'
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
                    {table.getRowModel().rows.map(row => {
                      const employeeRow = row.original as Employee,
                        ok: boolean = needed.every(k => k in employeeRow)
                      return (
                        <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
                          {row.getVisibleCells().map(cell => (
                            <>
                              <TableCell className='py-0 pr-0' key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                              {cell.column.id === 'title' && (
                                <div className='mr-0.5 flex select-none items-center justify-end'>
                                  <Sheet>
                                    <SheetTrigger>
                                      <Tutip
                                        content={
                                          ok ? 'Contact available' : 'Contact need requested'
                                        }
                                        side='left'>
                                        <Button
                                          className={cn(
                                            'group relative z-10 my-px size-8 p-0 transition-all duration-300 *:transition-all *:duration-300 hover:scale-125 hover:bg-blue-100 hover:drop-shadow-lg dark:hover:bg-blue-900',
                                            !ok && 'hover:bg-yellow-100 dark:hover:bg-yellow-600'
                                          )}
                                          variant='ghost'>
                                          <PersonIcon className='size-4 group-hover:size-0' />
                                          {ok ? (
                                            <EnterIcon className='size-0 rotate-180 group-hover:size-4' />
                                          ) : (
                                            <>
                                              <ExclamationTriangleIcon className='absolute z-10 ml-3.5 mt-3 size-2 bg-background text-yellow-500 group-hover:size-0' />
                                              <LockOpen1Icon className='size-0 group-hover:size-4' />
                                            </>
                                          )}
                                        </Button>
                                      </Tutip>
                                    </SheetTrigger>
                                    <SheetContent className='flex flex-col p-0'>
                                      <Avatar className='mb-3 mt-5' employee={employeeRow} />
                                      <Contact
                                        className={ok ? 'relative' : 'hidden'}
                                        employee={employeeRow}
                                      />
                                      <Button
                                        className={
                                          ok
                                            ? 'hidden'
                                            : 'group relative m-auto size-36 flex-col gap-1 rounded-2xl font-normal transition-all duration-300 hover:-translate-y-2 hover:font-semibold hover:drop-shadow-xl'
                                        }
                                        onClick={async () => {
                                          const contact = await runGetContact(
                                            _user.email,
                                            employeeRow.id
                                          )
                                          if (contact) {
                                            setEmployees({
                                              ...employees,
                                              [id]: (employees[id] ?? []).map(e =>
                                                e.id === employeeRow.id
                                                  ? { ...employeeRow, ...contact }
                                                  : e
                                              )
                                            })
                                            toast.success('Contact unlocked successfully')
                                          } else {
                                            toast.error('Contact unlock failed')
                                          }
                                          toast.dismiss()
                                        }}
                                        variant='secondary'>
                                        <LockClosedIcon className='size-16 group-hover:hidden' />
                                        <LockOpen1Icon className='hidden size-16 group-hover:block' />
                                        <p className='flex items-center'>
                                          <p
                                            className={cn(
                                              'mr-1 size-0 animate-spin rounded-full border-foreground border-t-transparent transition-all duration-500',
                                              contactPending && 'size-4 border'
                                            )}
                                          />
                                          Unlock Contact
                                        </p>
                                      </Button>
                                    </SheetContent>
                                  </Sheet>

                                  <Tutip content='Send email' side='left'>
                                    <Button
                                      className='group relative z-10 size-8 p-0 transition-all duration-300 *:transition-all *:duration-300 hover:-translate-x-1 hover:scale-125 hover:bg-green-100 hover:drop-shadow-lg dark:hover:bg-green-900'
                                      onClick={() => {
                                        setOpen(true)
                                        setFocusEmployee(employeeRow)
                                      }}
                                      variant='ghost'>
                                      <EnvelopeClosedIcon className='size-4 group-hover:size-5' />
                                    </Button>
                                  </Tutip>
                                </div>
                              )}
                            </>
                          ))}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <Pagination rowSingular='employee' table={table} />
              </TabsContent>
              <TabsContent
                className='m-0 grid grid-cols-[repeat(auto-fill,minmax(12em,1fr))]'
                value='grid'>
                {(employees[id] ?? []).map((e, i) => (
                  <Avatar clamp employee={e} key={i} />
                ))}
              </TabsContent>
            </Tabs>
          ) : null}
        </TabsContent>
      </Tabs>
    </>
  )
}
