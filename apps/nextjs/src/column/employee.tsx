import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@a/ui/hover-card'

import type { Employee } from '~/types'
import Avatar from '~/app/avatar'
import Blink from '~/components/blink'
import Shine from '~/components/shine'
import Header from '~/table/col-header'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<unknown, any>[] = [
  {
    accessorKey: 'name',
    cell: ({ row, getValue }) => (
      <HoverCard closeDelay={100} openDelay={0}>
        <HoverCardTrigger>
          <Link
            className='notranslate relative mr-1 line-clamp-1 w-fit break-all font-medium text-foreground/80 transition-all duration-300 after:absolute after:bottom-0.5 after:left-1/3 after:h-px after:w-0 after:bg-blue-700 after:transition-all after:duration-300 hover:text-blue-700 hover:after:w-full hover:after:-translate-x-1/3 dark:hover:text-blue-300'
            href={`https://linkedin.com/in/${(row.original as Employee).linkedin}`}
            target='_blank'>
            {(row.original as Employee).star ? (
              <Shine repeatDelay={-2.5}>{getValue()}</Shine>
            ) : (
              getValue()
            )}
          </Link>
        </HoverCardTrigger>
        <HoverCardContent
          className='w-fit px-2 pb-1 transition-all duration-300 hover:drop-shadow-xl'
          side='right'
          sideOffset={-12}>
          <Avatar employee={row.original as Employee} />
        </HoverCardContent>
      </HoverCard>
    ),
    enableHiding: false,
    header: ({ column }) => (
      <Header className='justify-start' column={column}>
        {column.id}
      </Header>
    )
  },
  {
    accessorKey: 'title',
    cell: ({ getValue, row }) => (
      <div className='flex items-center justify-between'>
        <p className='line-clamp-1 max-w-60 font-light text-foreground/60'>
          {(row.original as Employee).star ? (
            <Shine repeatDelay={-2.5}>{getValue()}</Shine>
          ) : (
            getValue()
          )}
        </p>
        {(row.original as Employee).star ? <Blink /> : null}
      </div>
    ),
    header: ({ column }) => (
      <Header className='justify-start' column={column}>
        {column.id}
      </Header>
    )
  }
]

export default columns
