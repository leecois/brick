import { useActionState } from 'react'
import { UploadIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@a/ui/tabs'

import { file2keyword, url2keyword } from '~/actions'
import FillInput from '~/components/fill-input'
import { ScrollArea } from '~/components/scroll-area'
import Tutip from '~/components/tutip'
import Upload from '~/components/upload-form'
import UrlForm from '~/components/url-form'

export default function Gen() {
  const [fromWebsite, fromWebsiteAction, url2keywordPending] = useActionState(
      url2keyword as (state: string[], payload: unknown) => Promise<string[]>,
      []
    ),
    [fromFile, fromFileAction, file2keywordPending] = useActionState(
      file2keyword as (state: string[], payload: unknown) => Promise<string[]>,
      []
    )

  return (
    <Popover>
      <Tutip content='Generate Keywords with AI' side='left'>
        <PopoverTrigger asChild>
          <Button
            className='group absolute right-[3px] top-[3px] size-7 transition-all duration-500 hover:bg-stone-200 dark:hover:bg-stone-600'
            size='icon'
            variant='ghost'>
            <UploadIcon className='size-5 text-muted-foreground transition-all duration-500 group-hover:scale-110 group-hover:text-foreground' />
          </Button>
        </PopoverTrigger>
      </Tutip>
      <PopoverContent className='m-1 w-[400px] rounded-xl px-3 pb-1 pt-3 drop-shadow-lg transition-all duration-300 hover:shadow-xl hover:drop-shadow-2xl'>
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
              disabled={file2keywordPending}
              form='upload'
              type='submit'>
              Generate Keywords with AI
              <p
                className={cn(
                  'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
                  file2keywordPending && 'size-5 border'
                )}
              />
            </Button>
            <ScrollArea className='mt-2 flex max-h-[calc(100vh-31rem)] flex-col'>
              <FillInput inputId='search-input' list={fromFile} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value='website'>
            <UrlForm action={fromWebsiteAction} />
            <Button
              className='mt-3.5 w-full'
              disabled={url2keywordPending}
              form='url-form'
              type='submit'>
              Generate Keywords with AI
              <p
                className={cn(
                  'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
                  url2keywordPending && 'size-5 border'
                )}
              />
            </Button>
            <ScrollArea className='mt-2 flex max-h-[calc(100vh-17rem)] flex-col'>
              <FillInput inputId='search-input' list={fromWebsite} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
