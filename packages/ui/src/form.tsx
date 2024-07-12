'use client'

import type * as LabelPrimitive from '@radix-ui/react-label'
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'

import { cn } from '@a/ui'

import { Label } from './label'

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
}

interface FormItemContextValue {
  id: string
}

const Form = FormProvider,
  FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue),
  FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue),
  FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >({
    ...props
  }: ControllerProps<TFieldValues, TName>) => (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  ),
  useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext),
      itemContext = React.useContext(FormItemContext),
      { formState, getFieldState } = useFormContext(),
      fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext.name) {
      throw new Error('useFormField should be used within <FormField>')
    }

    const { id } = itemContext

    return {
      formDescriptionId: `${id}-form-item-description`,
      formItemId: `${id}-form-item`,
      formMessageId: `${id}-form-item-message`,
      id,
      name: fieldContext.name,
      ...fieldState
    }
  },
  FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const id = React.useId()

      return (
        <FormItemContext.Provider value={{ id }}>
          <div className={cn('space-y-2', className)} ref={ref} {...props} />
        </FormItemContext.Provider>
      )
    }
  ),
  FormLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
  >(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField()

    return (
      <Label
        className={cn(error && 'text-destructive', className)}
        htmlFor={formItemId}
        ref={ref}
        {...props}
      />
    )
  }),
  FormControl = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot>
  >(({ ...props }, ref) => {
    const { error, formDescriptionId, formItemId, formMessageId } = useFormField()

    return (
      <Slot
        aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
        aria-invalid={Boolean(error)}
        id={formItemId}
        ref={ref}
        {...props}
      />
    )
  }),
  FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()

    return (
      <p
        className={cn('text-[0.8rem] text-muted-foreground', className)}
        id={formDescriptionId}
        ref={ref}
        {...props}
      />
    )
  }),
  FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ children, className, ...props }, ref) => {
      const { error, formMessageId } = useFormField(),
        body = error ? String(error.message) : children

      if (!body) {
        return null
      }

      return (
        <p
          className={cn('text-[0.8rem] font-medium text-destructive', className)}
          id={formMessageId}
          ref={ref}
          {...props}>
          {body}
        </p>
      )
    }
  )

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
}
FormControl.displayName = 'FormControl'
FormDescription.displayName = 'FormDescription'
FormItem.displayName = 'FormItem'
FormLabel.displayName = 'FormLabel'
FormMessage.displayName = 'FormMessage'
