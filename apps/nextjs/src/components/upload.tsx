'use client'

import type { DropzoneProps, FileRejection } from 'react-dropzone'
import * as React from 'react'
import { useCallback, useEffect } from 'react'
import Image from 'next/image'
import { TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import Dropzone from 'react-dropzone'
import { toast } from 'sonner'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import { Progress } from '@a/ui/progress'

import { ScrollArea } from '~/components/scroll-area'

interface FileCardProps {
  readonly file: File
  readonly onRemove: () => void
  readonly progress?: number
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  readonly accept?: DropzoneProps['accept']

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  readonly disabled?: boolean

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  readonly maxFiles?: DropzoneProps['maxFiles']

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  readonly maxSize?: DropzoneProps['maxSize']

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  readonly multiple?: boolean

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  readonly onUpload?: (files: File[]) => Promise<void>

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  readonly onValueChange?: React.Dispatch<React.SetStateAction<File[]>>

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  readonly progresses?: Record<string, number>

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  readonly value?: File[]
}
const DEFAULT_ACCEPT = { 'image/*': [] },
  FileBytes = (
    bytes: number,
    opts: {
      decimals?: number
      sizeType?: 'accurate' | 'normal'
    } = {}
  ) => {
    if (bytes === 0) {
      return '0 Byte'
    }
    const { decimals = 0, sizeType = 'normal' } = opts,
      accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'],
      i = Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    return `${(bytes / 1024 ** i).toFixed(decimals)} ${
      sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytes' : sizes[i] ?? 'Bytes'
    }`
  },
  FileCanPreview = (file: File): file is File & { preview: string } =>
    'preview' in file && typeof file.preview === 'string',
  FileCard = ({ file, onRemove, progress }: FileCardProps) => (
    <div className='flex items-center'>
      <div className='flex grow'>
        {FileCanPreview(file) && (
          <Image
            alt={file.name}
            className='ml-3 mr-1 aspect-square shrink-0 rounded-md object-cover'
            height={48}
            onError={e => {
              if (!file.type.startsWith('image/')) {
                e.currentTarget.srcset = '/file.png'
              }
            }}
            src={file.preview}
            width={48}
          />
        )}
        <div className='flex w-full flex-col justify-center'>
          <p className='line-clamp-1 text-sm font-medium'>{file.name}</p>
          <p className='text-xs text-muted-foreground'>{FileBytes(file.size)}</p>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <Button
        className='group mr-3 transition-all duration-300 hover:scale-105 hover:bg-red-100 hover:drop-shadow-xl dark:hover:bg-red-950'
        onClick={onRemove}
        size='icon'
        type='button'
        variant='outline'>
        <TrashIcon className='size-6 transition-all duration-100 group-hover:scale-110 group-hover:text-red-500' />
      </Button>
    </div>
  ),
  FileUploader = ({
    accept = DEFAULT_ACCEPT,
    className,
    disabled = false,
    maxFiles = 1,
    maxSize = 1024 * 1024 * 2,
    multiple = false,
    onUpload,
    onValueChange,
    progresses,
    value: valueProp,
    ...dropzoneProps
  }: FileUploaderProps) => {
    const [files, setFiles] = useControllableState({
        onChange: onValueChange,
        prop: valueProp
      }),
      isDisabled = disabled || (files?.length ?? 0) >= maxFiles,
      onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
          if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
            toast.error('Cannot upload more than 1 file at a time')
            return
          }

          if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
            toast.error(`Cannot upload more than ${maxFiles} files`)
            return
          }

          const newFiles = acceptedFiles.map(file =>
              Object.assign(file, { preview: URL.createObjectURL(file) })
            ),
            updatedFiles = files ? [...files, ...newFiles] : newFiles

          setFiles(updatedFiles)

          if (rejectedFiles.length > 0) {
            rejectedFiles.forEach(({ file }) => toast.error(`File ${file.name} was rejected`))
          }

          if (onUpload && updatedFiles.length > 0 && updatedFiles.length <= maxFiles) {
            const target = updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

            toast.promise(onUpload(updatedFiles), {
              error: `Failed to upload ${target}`,
              loading: `Uploading ${target}...`,
              success: () => {
                setFiles([])
                return `${target} uploaded`
              }
            })
          }
        },

        [files, maxFiles, multiple, onUpload, setFiles]
      ),
      onRemove = (index: number) => {
        if (!files) {
          return
        }
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onValueChange?.(newFiles)
      }

    useEffect(() => {
      if (!files) {
        return
      }
      files.forEach(file => {
        if (FileCanPreview(file)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }, [])

    return (
      <div className='relative flex flex-col overflow-hidden'>
        <Dropzone
          accept={accept}
          disabled={isDisabled}
          maxFiles={maxFiles}
          maxSize={maxSize}
          multiple={maxFiles > 1 || multiple}
          onDrop={onDrop}>
          {({ getInputProps, getRootProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isDragActive && 'border-muted-foreground/50',
                isDisabled && 'pointer-events-none opacity-60',
                className
              )}
              {...dropzoneProps}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                  <div className='rounded-full border border-dashed p-3'>
                    <UploadIcon className='size-7 text-muted-foreground' />
                  </div>
                  <p className='font-medium text-muted-foreground'>Drop the files here</p>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                  <div className='rounded-full border border-dashed p-3'>
                    <UploadIcon className='size-7 text-muted-foreground' />
                  </div>
                  <div className='space-y-px'>
                    <p className='font-medium text-muted-foreground'>
                      Drag & drop files or click to select files
                    </p>
                    <p className='text-sm text-muted-foreground/70'>
                      You can upload
                      {maxFiles > 1
                        ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                        files (up to ${FileBytes(maxSize)} each)`
                        : ` a file with ${FileBytes(maxSize)}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        {files?.length ? (
          <ScrollArea className='notranslate mt-3 h-fit w-full'>
            <div className='max-h-48 space-y-4'>
              {files.map((file, i) => (
                <FileCard
                  file={file}
                  key={i}
                  onRemove={() => onRemove(i)}
                  progress={progresses?.[file.name]}
                />
              ))}
            </div>
          </ScrollArea>
        ) : null}
      </div>
    )
  }

export default FileUploader
