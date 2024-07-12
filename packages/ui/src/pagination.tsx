import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'

import type { ButtonProps } from './button'
import { buttonVariants } from './button'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
    <nav
      aria-label='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      role='navigation'
      {...props}
    />
  ),
  PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
    ({ className, ...props }, ref) => (
      <ul className={cn('flex flex-row items-center gap-1', className)} ref={ref} {...props} />
    )
  ),
  PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
    ({ className, ...props }, ref) => <li className={cn('', className)} ref={ref} {...props} />
  )

type PaginationLinkProps = {
  readonly isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          size,
          variant: isActive ? 'outline' : 'ghost'
        }),
        className
      )}
      {...props}
    />
  ),
  PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
      aria-label='Go to previous page'
      className={cn('gap-1 pl-2.5', className)}
      size='default'
      {...props}>
      <ChevronLeftIcon className='size-4' />
      <span>Previous</span>
    </PaginationLink>
  ),
  PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
      aria-label='Go to next page'
      className={cn('gap-1 pr-2.5', className)}
      size='default'
      {...props}>
      <span>Next</span>
      <ChevronRightIcon className='size-4' />
    </PaginationLink>
  ),
  PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
    <span
      aria-hidden
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}>
      <DotsHorizontalIcon className='size-4' />
      <span className='sr-only'>More pages</span>
    </span>
  )

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
}
PaginationContent.displayName = 'PaginationContent'
Pagination.displayName = 'Pagination'
PaginationEllipsis.displayName = 'PaginationEllipsis'
PaginationItem.displayName = 'PaginationItem'
PaginationLink.displayName = 'PaginationLink'
PaginationNext.displayName = 'PaginationNext'
PaginationPrevious.displayName = 'PaginationPrevious'
