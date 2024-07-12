import type { FieldValues, UseFormProps } from 'react-hook-form'
import type { ZodType, ZodTypeDef } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const useZodForm = <TOut extends FieldValues, TDef extends ZodTypeDef, TIn extends FieldValues>(
  props: Omit<UseFormProps<TIn>, 'resolver'> & { schema: ZodType<TOut, TDef, TIn> }
) => useForm<TIn, unknown, TOut>({ ...props, resolver: zodResolver(props.schema, undefined) })

export default useZodForm
