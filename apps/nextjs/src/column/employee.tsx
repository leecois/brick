import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { Checkbox } from '@a/ui/checkbox'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@a/ui/hover-card'

import type { Employee } from '~/types'
import Avatar from '~/app/avatar'
import Blink from '~/components/blink'
import Shine from '~/components/shine'
import { DataTableColumnHeader } from '~/table/col-header'

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} className='justify-start' />
    ),
    cell: ({ row, getValue }) => (
      <HoverCard openDelay={0} closeDelay={100}>
        <HoverCardTrigger>
          <Link
            className='notranslate relative mr-1 line-clamp-1 w-fit break-all font-medium transition-all duration-300 after:absolute after:bottom-0.5 after:left-1/3 after:h-px after:w-0 after:bg-blue-700 after:transition-all after:duration-300 hover:text-blue-700 hover:after:w-full hover:after:-translate-x-1/3 dark:hover:text-blue-300'
            target='_blank'
            href={'https://linkedin.com/in/' + (row.original as Employee).linkedin}>
            {(row.original as Employee).star ? <Shine>{getValue()}</Shine> : getValue()}
          </Link>
        </HoverCardTrigger>
        <HoverCardContent
          sideOffset={-12}
          side='right'
          className='w-fit px-2 pb-1 transition-all duration-300 hover:drop-shadow-xl'>
          <Avatar employee={row.original as Employee} />
        </HoverCardContent>
      </HoverCard>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} className='justify-start' />
    ),
    cell: ({ getValue, row }) => (
      <div className='flex items-center justify-between'>
        <p className='line-clamp-1 max-w-60 opacity-75'>
          {(row.original as Employee).star ? <Shine>{getValue()}</Shine> : getValue()}
        </p>
        {(row.original as Employee).star && <Blink />}
      </div>
    )
  }
]

export default columns
