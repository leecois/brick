import * as React from 'react'
import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@a/ui'

const Breadcrumb = React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithoutRef<'nav'> & {
      separator?: React.ReactNode
    }
  >(({ ...props }, ref) => <nav aria-label='breadcrumb' ref={ref} {...props} />),
  BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
    ({ className, ...props }, ref) => (
      <ol
        className={cn(
          'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  ),
  BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
    ({ className, ...props }, ref) => (
      <li className={cn('inline-flex items-center gap-1.5', className)} ref={ref} {...props} />
    )
  ),
  BreadcrumbLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<'a'> & {
      asChild?: boolean
    }
  >(({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a'

    return (
      <Comp
        className={cn('transition-colors hover:text-foreground', className)}
        ref={ref}
        {...props}
      />
    )
  }),
  BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
    ({ className, ...props }, ref) => (
      <span
        aria-current='page'
        aria-disabled='true'
        className={cn('font-normal text-foreground', className)}
        ref={ref}
        role='link'
        {...props}
      />
    )
  ),
  BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
    <li
      aria-hidden='true'
      className={cn('[&>svg]:size-3.5', className)}
      role='presentation'
      {...props}>
      {children ?? <ChevronRightIcon />}
    </li>
  ),
  BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
    <span
      aria-hidden='true'
      className={cn('flex size-9 items-center justify-center', className)}
      role='presentation'
      {...props}>
      <DotsHorizontalIcon className='size-4' />
      <span className='sr-only'>More</span>
    </span>
  )

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
}
Breadcrumb.displayName = 'Breadcrumb'
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'
BreadcrumbItem.displayName = 'BreadcrumbItem'
BreadcrumbLink.displayName = 'BreadcrumbLink'
BreadcrumbList.displayName = 'BreadcrumbList'
BreadcrumbPage.displayName = 'BreadcrumbPage'
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'
