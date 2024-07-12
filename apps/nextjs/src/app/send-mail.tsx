import Image from 'next/image'
import { EnvelopeClosedIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'
import pluralize from 'pluralize'
import { toast } from 'sonner'
import { z } from 'zod'

import { Badge } from '@a/ui/badge'
import { Button } from '@a/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@a/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@a/ui/form'
import { Input } from '@a/ui/input'

import type { Employee } from '~/types'
import { Textarea } from '~/components/textarea'
import useForm from '~/hook/use-form'

const FormSchema = z.object({
  mails: z.array(z.string()),
  message: z.string().min(1, { message: 'Required' }),
  subject: z.string().min(1, { message: 'Required' }),
  user: z.string()
})

interface MailData {
  mails: string[]
  message: string
  subject: string
  user: string
}
interface MailProps {
  readonly action: (data: MailData) => void
  readonly children: React.ReactNode
  readonly employees: Employee[]
}

export default function SendMail({ action, children, employees }: MailProps) {
  const { data: session } = useSession(),
    missing = employees.filter(e => !e.mail).length,
    mails = employees.map(e => e.mail),
    form = useForm({
      defaultValues: {
        mails,
        message: '',
        subject: '',
        user: session?.user.email
      },
      schema: FormSchema
    })
  return (
    <Dialog>
      {employees.length ? <DialogTrigger className='z-10'>{children}</DialogTrigger> : children}
      <DialogContent className='gap-1 p-2'>
        {missing ? (
          <p className='py-1 text-center'>
            Missing {missing} {pluralize('email', missing)}
          </p>
        ) : (
          <>
            <p className='mb-1 ml-2 text-lg font-medium'>New Email</p>
            <div className='ml-2 flex flex-wrap items-center gap-1 text-sm'>
              To
              {employees.map(e => (
                <Badge className='rounded-full px-0.5 font-normal' key={e.id} variant='secondary'>
                  {e.ava ? (
                    <Image
                      alt=''
                      className='my-px rounded-full'
                      height={18}
                      onError={ev => (ev.currentTarget.srcset = '/ava.png')}
                      src={e.ava}
                      width={18}
                    />
                  ) : (
                    <Image
                      alt=''
                      className='my-px rounded-full'
                      height={18}
                      onError={ev => (ev.currentTarget.srcset = '/ava.png')}
                      src='/ava.png'
                      width={18}
                    />
                  )}
                  {e.mail ? <p className='px-1'>{e.mail}</p> : null}
                </Badge>
              ))}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(data => {
                  toast('Sending email...', {
                    description: `Recipients: ${mails.join(', ')}`
                  })
                  action(data as MailData)
                })}>
                <FormField
                  control={form.control}
                  name='subject'
                  render={({ field }) => (
                    <FormItem className='mr-3 flex'>
                      <FormControl>
                        <Input
                          className='rounded-none border-0 p-2 shadow-none placeholder:opacity-70 focus-visible:ring-0 focus-visible:placeholder:opacity-35'
                          placeholder='Subject'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem className='mr-3 flex'>
                      <FormControl>
                        <Textarea
                          className='rounded-none border-0 border-t p-2 shadow-none placeholder:opacity-70 focus-visible:ring-0 focus-visible:placeholder:opacity-35'
                          placeholder='Enter your message'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-end'>
                  <Button
                    className='group relative px-3 *:transition-all *:duration-300'
                    type='submit'>
                    <p className='mr-2.5'>Send</p>
                    <EnvelopeClosedIcon className='size-4 group-hover:size-0' />
                    <PaperPlaneIcon className='size-0 -translate-y-px -rotate-45 group-hover:size-4' />
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
