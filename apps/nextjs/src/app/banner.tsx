import Image from 'next/image'
import Link from 'next/link'
import { DrawingPinIcon, HomeIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'
import { Badge } from '@a/ui/badge'

import type { Company } from '~/types'
import { nameToIso, url2source } from '~/utils'
import Logo from './logo'

import '../../../../node_modules/flag-icons/css/flag-icons.min.css'

const Banner = ({ company }: { readonly company: Company }) => {
  const { address, ava, country, id, url } = company,
    iso = country && nameToIso(country),
    source = url2source(id)
  return (
    <>
      {ava ? (
        <Image
          alt=''
          className='-my-20 h-44 w-full scale-110 blur-lg'
          height={300}
          onError={e => (e.currentTarget.srcset = '/company.png')}
          src={ava}
          width={300}
        />
      ) : (
        <Image
          alt=''
          className='-my-20 h-44 w-full scale-110 blur-lg'
          height={300}
          src='/company.png'
          width={300}
        />
      )}
      <div className='relative flex flex-col items-center justify-between px-2.5 *:transition-all *:duration-300 lg:flex-row'>
        {ava ? (
          <Image
            alt=''
            className='mb-1 size-32 rounded-full border-2 shadow-lg hover:drop-shadow-xl'
            height={300}
            onError={e => (e.currentTarget.srcset = '/company.png')}
            src={ava}
            width={300}
          />
        ) : (
          <Image
            alt=''
            className='mb-1 size-32 rounded-full border-2 shadow-lg hover:drop-shadow-xl'
            height={300}
            src='/company.png'
            width={300}
          />
        )}
        {iso ? (
          <Badge
            className='group flex-col rounded-2xl bg-background/35 pl-2.5 pr-2 font-normal *:transition-all *:duration-500 hover:py-1'
            variant='secondary'>
            <div className='flex w-full justify-between gap-2 *:transition-all *:duration-500 group-hover:gap-4'>
              <p className='tracking-tight group-hover:text-lg group-hover:tracking-tighter'>
                {country}
              </p>
              <p className={cn('fi mr-1.5 group-hover:scale-150', `fi-${iso.toLowerCase()}`)} />
            </div>
            {address ? (
              <div className='notranslate flex h-0 w-full items-center justify-between gap-2 text-[0] group-hover:h-6 group-hover:text-xs'>
                {address}
                <DrawingPinIcon className='size-0 rounded-full border-transparent bg-background transition-all duration-500 group-hover:size-5 group-hover:border group-hover:p-0.5' />
              </div>
            ) : null}
          </Badge>
        ) : null}
        <div className='notranslate flex flex-col items-start rounded-xl bg-background/35 px-3 py-2.5 text-lg font-normal capitalize *:flex *:gap-2 *:text-foreground'>
          {url ? (
            <div>
              <HomeIcon className='size-6' />
              <Link
                className='relative text-foreground/70 transition-all duration-300 after:absolute after:bottom-0.5 after:left-1/3 after:h-px after:w-0 after:bg-blue-700 after:transition-all after:duration-300 hover:text-blue-700 hover:after:w-full hover:after:-translate-x-1/3 dark:hover:text-blue-300'
                href={url}
                target='_blank'>
                website
              </Link>
            </div>
          ) : null}
          <div>
            <Logo size={24} source={source} />
            <Link
              className='relative text-foreground/70 transition-all duration-300 after:absolute after:bottom-0.5 after:left-1/3 after:h-px after:w-0 after:bg-blue-700 after:transition-all after:duration-300 hover:text-blue-700 hover:after:w-full hover:after:-translate-x-1/3 dark:hover:text-blue-300'
              href={(source === 'linkedin' ? 'https://linkedin.com/company/' : '') + id}
              target='_blank'>
              {source}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
export default Banner
