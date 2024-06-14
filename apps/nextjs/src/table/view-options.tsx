'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { EyeNoneIcon } from '@radix-ui/react-icons'

import { Button } from '@a/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@a/ui/dropdown-menu'

import type { DataTableViewOptionsProps } from '~/table/interfaces'

export function DataTableViewOptions<TData>({
  table,
  className
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className={className}>
          <EyeNoneIcon className='mr-2 size-4' />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map(column => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}>
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
