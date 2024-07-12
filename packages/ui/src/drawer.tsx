'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@a/ui'

const Drawer = ({
    shouldScaleBackground = true,
    ...props
  }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
    <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
  ),
  DrawerTrigger = DrawerPrimitive.Trigger,
  DrawerPortal = DrawerPrimitive.Portal,
  DrawerClose = DrawerPrimitive.Close,
  DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
  >(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
      className={cn('fixed inset-0 z-50 bg-black/80', className)}
      ref={ref}
      {...props}
    />
  )),
  DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
  >(({ children, className, ...props }, ref) => (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
          className
        )}
        ref={ref}
        {...props}>
        <div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted' />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )),
  DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
  ),
  DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
  ),
  DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
  >(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      ref={ref}
      {...props}
    />
  )),
  DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
  >(({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      ref={ref}
      {...props}
    />
  ))

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger
}
DrawerContent.displayName = 'DrawerContent'
DrawerDescription.displayName = DrawerPrimitive.Description.displayName
Drawer.displayName = 'Drawer'
DrawerFooter.displayName = 'DrawerFooter'
DrawerHeader.displayName = 'DrawerHeader'
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName
DrawerTitle.displayName = DrawerPrimitive.Title.displayName
