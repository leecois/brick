import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'
import { ExclamationTriangleIcon, HomeIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'
import { buttonVariants } from '@a/ui/button'
import { Checkbox } from '@a/ui/checkbox'
import { ScrollArea } from '@a/ui/scroll-area'

import type { Company, Source } from '~/types'
import Logo from '~/app/logo'
import Globe from '~/components/globe'
import Tutip from '~/components/tutip'
import { DataTableColumnHeader } from '~/table/col-header'
import { nameToIso } from '~/utils'

import '../../../../node_modules/flag-icons/css/flag-icons.min.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<unknown, any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='mx-2 transition-all duration-300 hover:scale-110'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='mx-2 transition-all duration-300 hover:scale-110'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Company' />,
    cell: ({ row }) => {
      const company = row.original as Company
      const { ava, id, name, url } = company
      let source: Source = 'linkedin'
      if (id.includes('europages.co')) {
        source = 'europages'
      } else if (id.includes('kompass.com')) {
        source = 'kompass'
      }
      return (
        <div className='flex items-center gap-1 sm:min-w-52'>
          {'ava' in company && (
            <Image
              onError={e => (e.currentTarget.srcset = '/company.png')}
              className='size-9 rounded-full'
              src={ava}
              alt=''
              width={50}
              height={50}
            />
          )}
          <div className='flex flex-col'>
            {url && (
              <Tutip content='Website' side='right'>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'link', size: 'icon' }),
                    'size-5 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-green-600'
                  )}
                  target='_blank'
                  href={url}>
                  <HomeIcon className='size-4' />
                </Link>
              </Tutip>
            )}
            <Tutip content={source} side='right'>
              <Link
                className={cn(
                  buttonVariants({ variant: 'link', size: 'icon' }),
                  'size-5 opacity-30 transition-all duration-300 hover:scale-110 hover:text-[#0762C8] hover:opacity-100'
                )}
                target='_blank'
                href={(source === 'linkedin' ? 'https://linkedin.com/company/' : '') + id}>
                <Logo source={source} size={16} />
              </Link>
            </Tutip>
          </div>
          <p className='line-clamp-3 text-pretty font-medium leading-4'>{name}</p>
        </div>
      )
    },
    sortingFn: 'text',
    enableHiding: false
  },
  {
    accessorKey: 'country',
    header: ({ column }) => (
      <div className='flex items-center'>
        <Globe className='ml-1.5 size-8' />
        <DataTableColumnHeader column={column} title='' />
      </div>
    ),
    cell: ({ getValue }) => {
      const n = getValue() as string
      const iso = nameToIso(n)
      return (
        <div className='ml-1 mr-3 flex justify-center'>
          <Tutip content={iso ? n : 'Country ' + n} side='left'>
            {iso ? (
              <p
                className={cn(
                  'fi scale-[1.7] rounded-[2] transition-all duration-300 hover:scale-[2] hover:rounded-none hover:drop-shadow-lg',
                  'fi-' + iso.toLowerCase()
                )}
              />
            ) : (
              <ExclamationTriangleIcon className='text-red-500' />
            )}
          </Tutip>
        </div>
      )
    },
    filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id))
  },
  {
    accessorKey: 'industry',
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id)),
    cell: ({ getValue }) => <p className='text-pretty leading-4'>{getValue()}</p>
  },
  {
    accessorKey: 'employeeCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='employee' />,
    cell: ({ getValue }) => <p className='text-center'>{getValue()}</p>
  },
  {
    accessorKey: 'searchQueries',
    header: () => <p className='text-center'>Keywords</p>,
    cell: ({ getValue }) => (
      <ScrollArea className='h-12 min-w-64 leading-4 marker:text-stone-400 dark:marker:text-stone-500'>
        {(getValue() as string[]).map((query: string, i: number) => (
          <li className='list-decimal' key={i}>
            {query}
          </li>
        ))}
      </ScrollArea>
    ),
    filterFn: (row, id, value) =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (row.getValue(id) as string[]).some((query: string) => (value as string[]).includes(query))
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <p className='hidden text-center capitalize lg:block'>{column.id}</p>,
    cell: ({ getValue }) => (
      <ScrollArea className='mr-1.5 hidden h-12 text-pretty leading-4 lg:block'>
        {getValue()}
      </ScrollArea>
    )
  }
]
export default columns
