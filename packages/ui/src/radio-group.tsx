'use client'

import * as React from 'react'
import { CheckIcon } from '@radix-ui/react-icons'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@a/ui'

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
  >(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />
  )),
  RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
  >(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Item
      className={cn(
        'aspect-square size-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}>
      <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
        <CheckIcon className='size-3.5 fill-primary' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  ))

export { RadioGroup, RadioGroupItem }
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
