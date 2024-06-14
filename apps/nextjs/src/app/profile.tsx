import type { SortingState } from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CircleBackslashIcon,
  DashboardIcon,
  EnterIcon,
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  ListBulletIcon,
  LockClosedIcon,
  LockOpen1Icon,
  PersonIcon,
  SewingPinIcon,
  UpdateIcon
} from '@radix-ui/react-icons'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import pluralize from 'pluralize'
import { toast } from 'sonner'

import { cn } from '@a/ui'
import { Badge } from '@a/ui/badge'
import { Button } from '@a/ui/button'
import { ScrollArea } from '@a/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@a/ui/sheet'
import { Skeleton } from '@a/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@a/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@a/ui/tabs'

import type { Company, Employee } from '~/types'
import columns from '~/column/employee'
import Tutip from '~/components/tutip'
import { useServerAction } from '~/hook/server-action'
import { DataTablePagination } from '~/table/pagination'
import { nameToIso } from '~/utils'
import { getContact, getEmployees, sendEmails } from './actions'
import Avatar from './avatar'
import Contact from './contact'
import Mail from './mail'

import '../../../../node_modules/flag-icons/css/flag-icons.min.css'

interface ProfileProps {
  user: string
  company: Company
}

export default function Profile({ user, company }: ProfileProps) {
  const [runGetEmployees, employeesPending] = useServerAction(getEmployees)
  const [runGetContact, contactPending] = useServerAction(getContact)
  const iso = nameToIso(company.country)
  const ref = useRef<HTMLDivElement>(null)
  const [clamped, setClamped] = useState(false)
  const [expand, setExpand] = useState(false)
  const [employees, setEmployees] = useState<Record<string, Employee[]>>({})

  function checkClamp() {
    if (ref.current) {
      setClamped(ref.current.scrollHeight > ref.current.clientHeight)
    }
  }
  const [tab, setTab] = useState('table')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageSize: 20, pageIndex: 0 })
  const table = useReactTable({
    data: employees[company.id] ?? [],
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })
  useEffect(() => {
    setExpand(false)
    const timeout = setTimeout(checkClamp, 0)
    return () => clearTimeout(timeout)
  }, [company.description])

  return (
    <ScrollArea className='h-screen'>
      <Image
        onError={e => (e.currentTarget.srcset = '/company.png')}
        src={company.ava}
        alt='cover'
        width={200}
        height={200}
        className='-my-20 h-44 w-full scale-110 blur-lg'
      />
      <div className='relative flex justify-between'>
        <Image
          onError={e => (e.currentTarget.srcset = '/company.png')}
          src={company.ava}
          alt='ava'
          width={200}
          height={200}
          className='mb-1 ml-3 size-32 rounded-full border-2 shadow-lg transition-all duration-200 hover:drop-shadow-xl'
        />
        {iso && (
          <Badge
            variant='secondary'
            className='group my-auto mr-3 flex-col pl-2.5 pr-2 font-normal transition-all duration-300 hover:rounded-2xl hover:py-1'>
            <div className='flex w-full justify-between gap-2 transition-all duration-300 group-hover:gap-4'>
              <p className='tracking-tight transition-all duration-300 group-hover:text-lg group-hover:tracking-tighter'>
                {company.country}
              </p>
              <p
                className={cn(
                  'fi mr-1.5 transition-all duration-300 group-hover:scale-150',
                  'fi-' + iso.toLowerCase()
                )}
              />
            </div>
            {company.address && (
              <div className='-mt-5 flex w-full scale-0 items-center justify-between gap-2 tracking-[-3] opacity-0 transition-all duration-300 group-hover:mb-0.5 group-hover:mt-0 group-hover:scale-100 group-hover:tracking-tighter group-hover:opacity-100'>
                {company.address}
                <div className='rounded-full border bg-background p-1'>
                  <SewingPinIcon className='size-3' />
                </div>
              </div>
            )}
          </Badge>
        )}
      </div>
      {company.url ? (
        <Link
          className='notranslate mb-1 ml-3 flex flex-wrap text-pretty text-2xl font-semibold tracking-normal decoration-1 transition-all duration-300 hover:text-3xl hover:font-bold hover:tracking-tight hover:text-blue-900 hover:underline hover:drop-shadow-lg dark:hover:text-blue-300'
          target='_blank'
          href={company.url}>
          {company.name}
        </Link>
      ) : (
        <p className='notranslate mb-1 ml-3 flex flex-wrap text-pretty text-2xl font-semibold tracking-normal transition-all duration-300 hover:text-3xl hover:font-bold hover:tracking-tight hover:drop-shadow-lg'>
          {company.name}
        </p>
      )}
      <p
        ref={ref}
        className={cn(
          '-mb-1 text-pretty px-3 leading-5 [overflow-wrap:anywhere]',
          !expand && 'line-clamp-5'
        )}>
        {company.description}
      </p>
      {clamped && (
        <button
          className='w-full px-3 text-left text-sm opacity-30'
          onClick={() => setExpand(!expand)}>
          {'Show ' + (expand ? 'less' : 'more')}
        </button>
      )}
      <div className={employeesPending ? 'space-y-1.5 pl-2 pr-3.5' : 'hidden'}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className='py-5' />
        ))}
      </div>
      <Button
        onClick={async () => {
          const data = await runGetEmployees(user, company.id)
          if (data) {
            setEmployees({ ...employees, [company.id]: data } as Record<string, Employee[]>)
            toast.success('Employees unlocked successfully')
          } else {
            toast.error('Employees not available')
          }
          toast.dismiss()
        }}
        className={
          employees[company.id] ?? employeesPending
            ? 'hidden'
            : 'group mx-auto mt-3 flex size-36 flex-col gap-1 rounded-2xl font-normal transition-all duration-300 hover:-translate-y-2 hover:font-semibold hover:drop-shadow-xl'
        }
        variant='secondary'>
        <LockClosedIcon className='size-16 group-hover:hidden' />
        <LockOpen1Icon className='hidden size-16 group-hover:block' />
        Unlock Employees
      </Button>
      {employees[company.id] && (
        <Tabs defaultValue='table' onValueChange={t => setTab(t)}>
          <div className='-mt-2 flex justify-between gap-2'>
            <p className='w-20' />
            {tab == 'table' && (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
              <Mail
                action={sendEmails}
                employees={table.getSelectedRowModel().rows.map(row => row.original as Employee)}>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-7 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:drop-shadow-lg'>
                  {'Send ' +
                    table.getFilteredSelectedRowModel().rows.length +
                    ' ' +
                    pluralize('email', table.getFilteredSelectedRowModel().rows.length) +
                    ' ' +
                    (table.getFilteredSelectedRowModel().rows.length > 1 ? ' separately' : '')}
                </Button>
              </Mail>
            )}
            <TabsList className='mr-2.5 h-7 px-0.5'>
              <TabsTrigger value='table' className='px-1'>
                <Tutip content='Table view' side='top'>
                  <ListBulletIcon />
                </Tutip>
              </TabsTrigger>
              <TabsTrigger value='grid' className='px-1'>
                <Tutip content='Grid view' side='top'>
                  <DashboardIcon />
                </Tutip>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='table' className='m-0'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan} className='h-8 p-0'>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map(row => {
                  const employee = row.original as Employee
                  const ok: boolean = [
                    'location',
                    'industry',
                    'mail',
                    'phone',
                    'work',
                    'verified'
                  ].every(k => k in employee)
                  return (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => {
                        return (
                          <>
                            <TableCell key={cell.id} className='p-0'>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            {cell.column.id === 'title' && (
                              <div className='mr-2 flex select-none items-center justify-end'>
                                <Sheet>
                                  <SheetTrigger>
                                    <Tutip
                                      content={ok ? 'Contact available' : 'Contact need requested'}
                                      side='left'>
                                      <Button
                                        variant='ghost'
                                        className={cn(
                                          'group z-10 my-px size-8 p-0 transition-all duration-300 hover:scale-125 hover:bg-blue-100 hover:drop-shadow-lg dark:hover:bg-blue-900',
                                          !ok && 'hover:bg-yellow-100 dark:hover:bg-yellow-600'
                                        )}>
                                        <PersonIcon
                                          className={cn(
                                            'transition-all duration-300 group-hover:-translate-x-full group-hover:scale-0',
                                            !ok && 'absolute'
                                          )}
                                        />
                                        {ok ? (
                                          <EnterIcon className='absolute translate-x-full rotate-180 scale-0 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-110' />
                                        ) : (
                                          <>
                                            <ExclamationTriangleIcon className='z-10 ml-3.5 mt-3 size-2 bg-background text-yellow-500 transition-all duration-300 group-hover:translate-x-full group-hover:scale-0' />
                                            <LockOpen1Icon className='absolute translate-x-full scale-0 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-110' />
                                          </>
                                        )}
                                      </Button>
                                    </Tutip>
                                  </SheetTrigger>
                                  <SheetContent className='flex flex-col p-0'>
                                    <Avatar employee={employee} className='mb-3 mt-5' />
                                    <Contact
                                      employee={employee}
                                      className={ok ? 'relative' : 'hidden'}
                                    />
                                    <Button
                                      onClick={async () => {
                                        const contact = await runGetContact(user, employee.id)
                                        if (contact) {
                                          setEmployees({
                                            ...employees,
                                            [company.id]: (employees[company.id] ?? []).map(e =>
                                              e.id === employee.id ? { ...employee, ...contact } : e
                                            )
                                          })
                                          toast.success('Contact unlocked successfully')
                                        } else {
                                          toast.error('Contact unlock failed')
                                        }
                                        toast.dismiss()
                                      }}
                                      className={
                                        ok
                                          ? 'hidden'
                                          : 'group relative m-auto size-36 flex-col gap-1 rounded-2xl font-normal transition-all duration-300 hover:-translate-y-2 hover:font-semibold hover:drop-shadow-xl'
                                      }
                                      variant='secondary'>
                                      <LockClosedIcon className='size-16 group-hover:hidden' />
                                      <LockOpen1Icon className='hidden size-16 group-hover:block' />
                                      <p className='flex items-center'>
                                        <UpdateIcon
                                          className={
                                            contactPending ? 'mr-1 animate-spin' : 'hidden'
                                          }
                                        />
                                        Unlock Contact
                                      </p>
                                    </Button>
                                  </SheetContent>
                                </Sheet>

                                <Mail action={sendEmails} employees={ok ? [employee] : []}>
                                  <Tutip
                                    content={ok ? 'Send email' : 'Email not available 🚫'}
                                    side='left'>
                                    <Button
                                      variant='ghost'
                                      className={cn(
                                        'group z-10 size-8 p-0 transition-all duration-300 hover:scale-125 hover:bg-green-100 hover:drop-shadow-lg dark:hover:bg-green-900',
                                        !ok && 'hover:bg-red-100 dark:hover:bg-red-900'
                                      )}>
                                      <EnvelopeClosedIcon
                                        className={cn(
                                          'transition-all duration-300 group-hover:scale-125',
                                          !ok &&
                                            'absolute text-muted-foreground group-hover:-translate-x-full group-hover:scale-0'
                                        )}
                                      />
                                      {!ok && (
                                        <>
                                          <CircleBackslashIcon className='z-10 ml-3.5 mt-2.5 size-2.5 rounded-full bg-background text-red-500 transition-all duration-300 group-hover:translate-x-full group-hover:scale-0' />
                                          <LockClosedIcon className='absolute translate-x-full scale-0 transition-all duration-300 group-hover:translate-x-0 group-hover:scale-110' />
                                        </>
                                      )}
                                    </Button>
                                  </Tutip>
                                </Mail>
                              </div>
                            )}
                          </>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <DataTablePagination table={table} rowString='employee' />
          </TabsContent>
          <TabsContent
            value='grid'
            className='m-0 grid grid-cols-[repeat(auto-fill,minmax(12em,1fr))]'>
            {(employees[company.id] ?? []).map((employee, i) => (
              <Avatar key={i} employee={employee} clamp />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </ScrollArea>
  )
}
