'use client'

import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'

const ContextMenu = ContextMenuPrimitive.Root,
  ContextMenuTrigger = ContextMenuPrimitive.Trigger,
  ContextMenuGroup = ContextMenuPrimitive.Group,
  ContextMenuPortal = ContextMenuPrimitive.Portal,
  ContextMenuSub = ContextMenuPrimitive.Sub,
  ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup,
  ContextMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
      inset?: boolean
    }
  >(({ children, className, inset, ...props }, ref) => (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        inset && 'pl-8',
        className
      )}
      ref={ref}
      {...props}>
      {children}
      <ChevronRightIcon className='ml-auto size-4' />
    </ContextMenuPrimitive.SubTrigger>
  )),
  ContextMenuSubContent = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
  >(({ className, ...props }, ref) => (
    <ContextMenuPrimitive.SubContent
      className={cn(
        'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      ref={ref}
      {...props}
    />
  )),
  ContextMenuContent = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
  >(({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(
          'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        ref={ref}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )),
  ContextMenuItem = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
      inset?: boolean
    }
  >(({ className, inset, ...props }, ref) => (
    <ContextMenuPrimitive.Item
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className
      )}
      ref={ref}
      {...props}
    />
  )),
  ContextMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
  >(({ checked, children, className, ...props }, ref) => (
    <ContextMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      ref={ref}
      {...props}>
      <span className='absolute left-2 flex size-3.5 items-center justify-center'>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className='size-4' />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )),
  ContextMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
  >(({ children, className, ...props }, ref) => (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      ref={ref}
      {...props}>
      <span className='absolute left-2 flex size-3.5 items-center justify-center'>
        <ContextMenuPrimitive.ItemIndicator>
          <DotFilledIcon className='size-4 fill-current' />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )),
  ContextMenuLabel = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
      inset?: boolean
    }
  >(({ className, inset, ...props }, ref) => (
    <ContextMenuPrimitive.Label
      className={cn(
        'px-2 py-1.5 text-sm font-semibold text-foreground',
        inset && 'pl-8',
        className
      )}
      ref={ref}
      {...props}
    />
  )),
  ContextMenuSeparator = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
  >(({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      ref={ref}
      {...props}
    />
  )),
  ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
}
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName
ContextMenuShortcut.displayName = 'ContextMenuShortcut'
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName
