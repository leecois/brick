'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@a/ui'

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
      ref={ref}
      {...props}
    />
  )),
  AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      className={cn('aspect-square size-full', className)}
      ref={ref}
      {...props}
    />
  )),
  AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      ref={ref}
      {...props}
    />
  ))

export { Avatar, AvatarFallback, AvatarImage }
Avatar.displayName = AvatarPrimitive.Root.displayName
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
AvatarImage.displayName = AvatarPrimitive.Image.displayName
