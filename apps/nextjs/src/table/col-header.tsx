import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'

import type { DataTableColumnHeaderProps } from '~/table/interfaces'

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }
  return (
    <Button
      variant='link'
      className={cn(
        'group m-0 h-0 w-full p-0 capitalize opacity-70 transition-all hover:no-underline',
        className
      )}
      onClick={() => column.toggleSorting()}>
      {title}
      {column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='mb-px duration-300 group-hover:scale-125' />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='mb-px duration-300 group-hover:scale-125' />
      ) : (
        <CaretSortIcon className='mb-px duration-300 group-hover:scale-125' />
      )}
    </Button>
  )
}
