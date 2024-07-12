'use client'

import { useSession } from 'next-auth/react'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@a/ui/form'

import FileUploader from '~/components/upload'
import useForm from '~/hook/use-form'

export default function UploadForm({ action }: { readonly action: (data: FormData) => void }) {
  const user = useSession().data?.user.email ?? '',
    zform = useForm({
      defaultValues: { files: [], user },
      schema: z.object({
        files: z.array(z.instanceof(File)).min(1),
        user: z.string()
      })
    })
  return (
    <Form {...zform}>
      <form
        id='upload'
        onSubmit={zform.handleSubmit(data => {
          const formData = new FormData()
          data.files.forEach(f => formData.append('files', f))
          formData.append('user', user)
          action(formData)
        })}>
        <FormField
          control={zform.control}
          name='files'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  accept={{
                    'application/msword': [],
                    'application/pdf': [],
                    'application/vnd.ms-excel': [],
                    'application/vnd.ms-powerpoint': [],
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                    'image/*': []
                  }}
                  maxFiles={1}
                  maxSize={4.5 * 1024 * 1024}
                  onValueChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
