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

import type { TableViewOptionsProps } from '~/table/interfaces'

const TableViewOptions = <TData,>({ className, table }: TableViewOptionsProps<TData>) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className={className} variant='outline'>
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
        .map(column => (
          <DropdownMenuCheckboxItem
            checked={column.getIsVisible()}
            className='capitalize'
            key={column.id}
            onCheckedChange={value => column.toggleVisibility(Boolean(value))}>
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

export default TableViewOptions
