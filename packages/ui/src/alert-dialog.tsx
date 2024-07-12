'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '@a/ui'

import { buttonVariants } from './button'

const AlertDialog = AlertDialogPrimitive.Root,
  AlertDialogTrigger = AlertDialogPrimitive.Trigger,
  AlertDialogPortal = AlertDialogPrimitive.Portal,
  AlertDialogOverlay = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
  >(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
      ref={ref}
    />
  )),
  AlertDialogContent = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
  >(({ className, ...props }, ref) => (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
          className
        )}
        ref={ref}
        {...props}
      />
    </AlertDialogPortal>
  )),
  AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
  ),
  AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  ),
  AlertDialogTitle = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
  >(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
      className={cn('text-lg font-semibold', className)}
      ref={ref}
      {...props}
    />
  )),
  AlertDialogDescription = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
  >(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      ref={ref}
      {...props}
    />
  )),
  AlertDialogAction = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Action>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
  >(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} ref={ref} {...props} />
  )),
  AlertDialogCancel = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
  >(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
      ref={ref}
      {...props}
    />
  ))

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
}
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName
AlertDialogFooter.displayName = 'AlertDialogFooter'
AlertDialogHeader.displayName = 'AlertDialogHeader'
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName
