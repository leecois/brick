'use client'

import * as React from 'react'

import { cn } from '@a/ui'

import { ScrollBar } from './scroll-area'
import { ScrollArea } from './scroll-area-only'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
      <ScrollArea>
        <table className={cn('w-full caption-bottom text-sm', className)} ref={ref} {...props} />
      </ScrollArea>
    )
  ),
  TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
  >(({ children, className, ...props }, ref) => (
    <tbody className={className} ref={ref} {...props}>
      {children}
      <tr>
        <td>
          <ScrollBar className='pb-1.5 pt-9' />
        </td>
      </tr>
    </tbody>
  )),
  TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
  >(({ className, ...props }, ref) => (
    <thead className={cn('sticky top-0 z-10 bg-background', className)} ref={ref} {...props} />
  ))

Table.displayName = 'Table'
TableBody.displayName = 'TableBody'
TableHeader.displayName = 'TableHeader'

export { Table, TableBody, TableHeader }
