'use client'

import type { VariantProps } from 'class-variance-authority'
import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'

import { cn } from '@a/ui'

import { toggleVariants } from './toggle'

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
    size: 'default',
    variant: 'default'
  }),
  ToggleGroup = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
      VariantProps<typeof toggleVariants>
  >(({ children, className, size, variant, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      className={cn('flex items-center justify-center gap-1', className)}
      ref={ref}
      {...props}>
      <ToggleGroupContext.Provider value={{ size, variant }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )),
  ToggleGroupItem = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
      VariantProps<typeof toggleVariants>
  >(({ children, className, size, variant, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)

    return (
      <ToggleGroupPrimitive.Item
        className={cn(
          toggleVariants({
            size: context.size ?? size,
            variant: context.variant ?? variant
          }),
          className
        )}
        ref={ref}
        {...props}>
        {children}
      </ToggleGroupPrimitive.Item>
    )
  })

export { ToggleGroup, ToggleGroupItem }
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName
