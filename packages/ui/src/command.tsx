'use client'

import type { DialogProps } from '@radix-ui/react-dialog'
import * as React from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Command as CommandPrimitive } from 'cmdk'

import { cn } from '@a/ui'

import { Dialog, DialogContent } from './dialog'

type CommandDialogProps = DialogProps

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
  >(({ className, ...props }, ref) => (
    <CommandPrimitive
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        className
      )}
      ref={ref}
      {...props}
    />
  )),
  CommandDialog = ({ children, ...props }: CommandDialogProps) => (
    <Dialog {...props}>
      <DialogContent className='overflow-hidden p-0'>
        <Command className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  ),
  CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
  >(({ className, ...props }, ref) => (
    // eslint-disable-next-line react/no-unknown-property
    <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
      <MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 opacity-50' />
      <CommandPrimitive.Input
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )),
  CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
  >(({ className, ...props }, ref) => (
    <CommandPrimitive.List
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
      ref={ref}
      {...props}
    />
  )),
  CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
  >((props, ref) => (
    <CommandPrimitive.Empty className='py-6 text-center text-sm' ref={ref} {...props} />
  )),
  CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
  >(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className
      )}
      ref={ref}
      {...props}
    />
  )),
  CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
  >(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
      className={cn('-mx-1 h-px bg-border', className)}
      ref={ref}
      {...props}
    />
  )),
  CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
  >(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )),
  CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator
}
Command.displayName = CommandPrimitive.displayName
CommandEmpty.displayName = CommandPrimitive.Empty.displayName
CommandGroup.displayName = CommandPrimitive.Group.displayName
CommandInput.displayName = CommandPrimitive.Input.displayName
CommandItem.displayName = CommandPrimitive.Item.displayName
CommandList.displayName = CommandPrimitive.List.displayName
CommandSeparator.displayName = CommandPrimitive.Separator.displayName
CommandShortcut.displayName = 'CommandShortcut'
