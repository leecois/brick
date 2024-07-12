import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'
import { ExclamationTriangleIcon, HomeIcon, StarFilledIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

import { cn } from '@a/ui'
import { buttonVariants } from '@a/ui/button'
import { Checkbox } from '@a/ui/checkbox'

import type { Company } from '~/types'
import Logo from '~/app/logo'
import { ScrollArea } from '~/components/scroll-area'
import Shine from '~/components/shine'
import Tutip from '~/components/tutip'
import Header from '~/table/col-header'
import { nameToIso, url2source } from '~/utils'

import '../../../../node_modules/flag-icons/css/flag-icons.min.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<unknown, any>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        className='mx-2 transition-all duration-300 hover:scale-110'
        onCheckedChange={value => row.toggleSelected(Boolean(value))}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        className='mx-2 transition-all duration-300 hover:scale-110'
        onCheckedChange={value => table.toggleAllPageRowsSelected(Boolean(value))}
      />
    ),
    id: 'select'
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => {
      const company = row.original as Company,
        { ava, id, name, url, unlocked } = company,
        source = url2source(id)
      return (
        <div className='flex items-center gap-1 sm:min-w-52'>
          {ava ? (
            <Image
              alt=''
              className='size-9 rounded-full'
              height={50}
              onError={e => (e.currentTarget.srcset = '/company.png')}
              src={ava}
              width={50}
            />
          ) : (
            <Image
              alt=''
              className='size-9 rounded-full'
              height={50}
              src='/company.png'
              width={50}
            />
          )}
          <div className='flex flex-col'>
            {url ? (
              <Tutip side='right'>
                <Link
                  className={cn(
                    buttonVariants({ size: 'icon', variant: 'link' }),
                    'size-5 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-green-600'
                  )}
                  href={url}
                  target='_blank'>
                  <HomeIcon className='size-4' />
                </Link>
              </Tutip>
            ) : null}
            <Tutip side='right'>
              <Link
                className={cn(
                  buttonVariants({ size: 'icon', variant: 'link' }),
                  'size-5 opacity-30 transition-all duration-300 hover:scale-110 hover:opacity-100'
                )}
                href={(source === 'linkedin' ? 'https://linkedin.com/company/' : '') + id}
                target='_blank'>
                <Logo size={16} source={source} />
              </Link>
            </Tutip>
          </div>
          {unlocked && motion.div ? (
            <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} transition={{ delay: 1 }}>
              <StarFilledIcon className='size-5 text-yellow-400' />
            </motion.div>
          ) : null}
          {unlocked ? (
            <Shine
              className='line-clamp-3 text-pretty text-base font-medium leading-4 tracking-[-0.06em]'
              repeatDelay={-1}>
              {name}
            </Shine>
          ) : (
            <p className='line-clamp-3 text-pretty text-base font-medium leading-4 tracking-[-0.06em]'>
              {name}
            </p>
          )}
        </div>
      )
    },
    enableHiding: false,
    header: ({ column }) => <Header column={column}>{column.id}</Header>,
    sortingFn: 'text'
  },
  {
    accessorKey: 'country',
    cell: ({ getValue }) => {
      const c = getValue() as string,
        iso = nameToIso(c)
      return (
        <div className='flex justify-center'>
          <Tutip content={c ? (iso ? c : `Country ${c}`) : 'N/A'} openDelay={1500} side='left'>
            {iso ? (
              <p
                className={cn(
                  'fi mx-3 rounded-md text-3xl transition-all duration-500 hover:scale-125 hover:rounded-none hover:drop-shadow-lg',
                  `fi-${iso.toLowerCase()}`
                )}
              />
            ) : (
              <ExclamationTriangleIcon className='text-red-500' />
            )}
          </Tutip>
        </div>
      )
    },
    filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id)),
    header: ({ column }) => (
      <Header className='h-8 text-background hover:text-background' column={column}>
        <Image alt='' className='absolute' height={32} src='/globe.gif' unoptimized width={32} />
      </Header>
    )
  },
  {
    accessorKey: 'industry',
    cell: ({ getValue }) => (
      <p className='text-pretty leading-4 text-foreground/80 transition-all duration-300 hover:text-foreground'>
        {getValue()}
      </p>
    ),
    filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id)),
    header: ({ column }) => <Header column={column}>{column.id}</Header>
  },
  {
    accessorKey: 'employeeCount',
    cell: ({ getValue }) => (
      <p className='notranslate text-center text-base font-extralight tracking-tighter transition-all duration-300 hover:text-xl'>
        {getValue()}
      </p>
    ),
    header: ({ column }) => <Header column={column}>employee</Header>
  },
  {
    accessorKey: 'searchQueries',
    cell: ({ getValue }) => (
      <ScrollArea className='h-12 min-w-64 leading-4 marker:text-stone-400 dark:marker:text-stone-500'>
        {(getValue() as string[]).map((query: string, i: number) => (
          <li className='list-decimal' key={i}>
            {query}
          </li>
        ))}
      </ScrollArea>
    ),
    filterFn: (row, id, value) =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (row.getValue(id) as string[]).some((query: string) => (value as string[]).includes(query)),
    header: () => <p className='text-center'>Keywords</p>
  },
  {
    accessorKey: 'description',
    cell: ({ getValue }) => (
      <ScrollArea className='hidden h-12 text-pretty font-light leading-4 lg:block'>
        {getValue()}
      </ScrollArea>
    ),
    header: ({ column }) => <p className='hidden text-center capitalize lg:block'>{column.id}</p>
  }
]
export default columns
