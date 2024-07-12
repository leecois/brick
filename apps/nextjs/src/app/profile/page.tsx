'use client'

import { useActionState, useEffect } from 'react'
import Image from 'next/image'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { each, isMatch } from 'lodash'
import { useSession } from 'next-auth/react'
import { singular } from 'pluralize'
import { useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import type { UserGeneratable, UserUpdatable } from '@a/db/schema'
import { UpdateUserSchema } from '@a/db/schema'
import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@a/ui/form'
import { Input } from '@a/ui/input'
import { Label } from '@a/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@a/ui/tabs'

import { file2profile, url2profile } from '~/actions'
import { ScrollArea } from '~/components/scroll-area'
import { Textarea } from '~/components/textarea'
import Tutip from '~/components/tutip'
import Upload from '~/components/upload-form'
import UrlForm from '~/components/url-form'
import useForm from '~/hook/use-form'
import { api } from '~/trpc/react'

const EMPTY: Record<string, Record<string, string>> = {
    addresses: { country: '', name: '' },
    products: { description: '', name: '' },
    socials: { platform: '', url: '' }
  },
  INITIAL_SUGGEST: UserGeneratable = {
    addresses: [],
    company: '',
    description: '',
    industries: [],
    mails: [],
    phones: [],
    products: [],
    socials: [],
    targets: [],
    websites: []
  },
  Page = () => {
    const [fromWebsite, fromWebsiteAction, url2profilePending] = useActionState(
        url2profile as (state: UserGeneratable, payload: unknown) => Promise<UserGeneratable>,
        INITIAL_SUGGEST
      ),
      [fromFile, fromFileAction, file2profilePending] = useActionState(
        file2profile as (state: UserGeneratable, payload: unknown) => Promise<UserGeneratable>,
        INITIAL_SUGGEST
      ),
      _session = useSession(),
      _user = _session.data?.user,
      form = useForm({ defaultValues: _user as UserUpdatable, schema: UpdateUserSchema }),
      hookMap = [
        'industries',
        'phones',
        'websites',
        'targets',
        'mails',
        'addresses',
        'products',
        'socials'
      ].reduce(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        (acc, name) => acc.set(name, useFieldArray({ control: form.control, name: name as '_' })),
        new Map()
      ) as Map<string, ReturnType<typeof useFieldArray>>,
      // eslint-disable-next-line sort-vars
      FieldArray = ({ name }: { readonly name: string }) => {
        const col = name === 'products',
          hook = hookMap.get(name) ?? {
            append: () => void 0,
            fields: [],
            remove: () => void 0
          }

        return (
          <div className={cn('flex flex-col gap-2', col && 'gap-0')} key={name}>
            <div className='mt-3 flex justify-between'>
              <Label className='capitalize'>{name}</Label>
              <Tutip content={`New ${singular(name)}`} side='left'>
                <PlusIcon
                  className='size-4 cursor-pointer rounded-full p-0.5 text-muted-foreground/70 transition-all duration-300 hover:bg-muted hover:text-foreground'
                  onClick={() => hook.append(EMPTY[name] ?? ('' as unknown as { _: string }))}
                />
              </Tutip>
            </div>
            {hook.fields.map((f, i) => (
              <div className={cn('flex items-end gap-2', col && 'mt-2 flex-col')} key={f.id}>
                {EMPTY[name] ? (
                  Object.keys(f)
                    .reverse()
                    .map(
                      k =>
                        k !== 'id' && (
                          <FormField
                            control={form.control}
                            key={k}
                            name={`${name}.${i}.${k}` as never}
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormMessage />
                                <FormControl>
                                  {k === 'description' ? (
                                    <Textarea
                                      className='placeholder:capitalize'
                                      {...field}
                                      placeholder={k}
                                    />
                                  ) : (
                                    <Input
                                      className='placeholder:capitalize'
                                      {...field}
                                      placeholder={k}
                                    />
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )
                    )
                ) : (
                  <FormField
                    control={form.control}
                    key={name}
                    name={`${name}.${i}` as never}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormMessage />
                        <FormControl>
                          <Input
                            className='placeholder:capitalize'
                            {...field}
                            placeholder={singular(name)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                <Tutip content='Delete' side='right'>
                  <Button
                    className='min-w-9 transition-all duration-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-800 dark:hover:text-red-100'
                    key={i}
                    onClick={() => hook.remove(i)}
                    size='icon'
                    type='button'
                    variant='outline'>
                    <TrashIcon className='size-5' />
                  </Button>
                </Tutip>
              </div>
            ))}
          </div>
        )
      },
      updateUser = api.user.update.useMutation({
        onSuccess: () => {
          void _session.update()
          toast.success('User information updated')
        }
      })

    useEffect(
      () =>
        [fromFile, fromWebsite].forEach(o => {
          if (o === INITIAL_SUGGEST) {
            return
          }
          each(o, (v, k) => {
            if (typeof v === 'object') {
              if (form.getValues()[k as '_']) {
                form.setValue(k as '_', [
                  ...(form.getValues()[k as '_'] ?? []),
                  ...(v as unknown as { _: string }[])
                ])
              } else {
                form.setValue(k as '_', v as unknown as { _: string }[])
              }
            } else {
              form.setValue(k as '_', v as unknown as { _: string }[])
            }
          })
        }),
      [fromFile, fromWebsite]
    )

    if (!_user) {
      return
    }
    return (
      <ScrollArea className='h-screen px-1 py-5'>
        <div className='flex items-center justify-start gap-5'>
          {_user.image ? (
            <Image
              alt=''
              className='ml-5 rounded-full transition-all duration-500 hover:shadow-xl hover:drop-shadow-xl'
              height={96}
              src={_user.image}
              width={96}
            />
          ) : null}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline'>Generate Profile with AI ✨</Button>
            </PopoverTrigger>
            <PopoverContent className='m-1 w-[400px] rounded-xl p-3 drop-shadow-lg transition-all duration-300 hover:shadow-xl hover:drop-shadow-2xl'>
              <Tabs defaultValue='files'>
                <TabsList className='mb-1 w-full'>
                  <TabsTrigger className='w-full' value='files'>
                    Files
                  </TabsTrigger>
                  <TabsTrigger className='notranslate w-full' value='website'>
                    Website
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='files'>
                  <Upload action={fromFileAction} />
                  <Button
                    className='mt-3 w-full'
                    disabled={file2profilePending}
                    form='upload'
                    type='submit'>
                    Generate
                    <p
                      className={cn(
                        'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
                        file2profilePending && 'size-5 border'
                      )}
                    />
                  </Button>
                </TabsContent>
                <TabsContent value='website'>
                  <UrlForm action={fromWebsiteAction} />
                  <Button
                    className='mt-3.5 w-full'
                    disabled={url2profilePending}
                    form='url-form'
                    type='submit'>
                    Generate
                    <p
                      className={cn(
                        'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
                        url2profilePending && 'size-5 border'
                      )}
                    />
                  </Button>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>

        <Form {...form}>
          <form
            className='grid grid-cols-3 divide-x-[1px] divide-dashed *:px-2'
            id='profile'
            onSubmit={form.handleSubmit(data => updateUser.mutate(data))}>
            <div className='mt-1'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your name' {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='job'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title</FormLabel>
                    <FormControl>
                      <Input placeholder='Your job' {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='company'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder='Your company' {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company description</FormLabel>
                    <FormControl>
                      <Textarea
                        className='min-h-36'
                        placeholder='Your company description'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              {['mails', 'phones', 'websites', 'targets', 'industries'].map(n => (
                <FieldArray key={n} name={n} />
              ))}
            </div>

            <div>
              {['products', 'addresses', 'socials'].map(n => (
                <FieldArray key={n} name={n} />
              ))}
            </div>
          </form>
        </Form>
        <Button
          className={cn(
            'fixed bottom-3 right-3 transition-all duration-500',
            isMatch(form.getValues(), _user) &&
              isMatch(_user, form.getValues()) &&
              'h-0 p-0 text-[0]'
          )}
          form='profile'
          type='submit'>
          Save information
          <p
            className={cn(
              'size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
              updateUser.isPending && 'ml-2 size-5 border'
            )}
          />
        </Button>
      </ScrollArea>
    )
  }
export default Page
