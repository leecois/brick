'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@a/ui'

const ScrollBar = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
  >(({ className, orientation = 'vertical', ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      className={cn(
        'flex touch-none select-none transition-all duration-300',
        orientation === 'vertical' && 'mr-px h-full w-0.5 hover:w-2',
        orientation === 'horizontal' && 'h-0.5 flex-col hover:h-2',
        className
      )}
      orientation={orientation}
      ref={ref}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb className='relative flex-1 rounded-full bg-border' />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )),
  ScrollArea = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
  >(({ children, className, ...props }, ref) => (
    <ScrollAreaPrimitive.Root
      className={cn('relative overflow-hidden', className)}
      ref={ref}
      {...props}>
      <ScrollAreaPrimitive.Viewport className='size-full rounded-[inherit]'>
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar />

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ))

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
