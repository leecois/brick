'use client'

import { GlobeIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'
import { z } from 'zod'

import type { UserModel } from '@a/db/schema'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@a/ui/form'
import { Input } from '@a/ui/input'

import useForm from '~/hook/use-form'

export default function UrlForm({ action }: { readonly action: (data: unknown) => void }) {
  const _user = useSession().data?.user as UserModel,
    form = useForm({
      defaultValues: {
        url: _user.websites ? _user.websites[0] : '',
        user: _user.email
      },
      schema: z.object({ url: z.string().url(), user: z.string() })
    })
  return (
    <Form {...form}>
      <form id='url-form' onSubmit={form.handleSubmit(action)}>
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative'>
                  <GlobeIcon className='absolute left-2 top-2 size-5 text-muted-foreground' />
                  <Input {...field} className='pl-8' placeholder='https://' />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
