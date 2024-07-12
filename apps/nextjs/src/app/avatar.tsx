import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@a/ui'

import type { Employee } from '~/types'
import Blink from '~/components/blink'

interface AvatarProps {
  readonly clamp?: boolean
  readonly className?: string
  readonly employee: Employee
}

const Avatar = ({ clamp = false, className, employee }: AvatarProps) => (
  <Link
    className={cn(
      'group relative mx-auto my-2 flex w-40 flex-col items-center *:transition-all *:duration-300',
      className
    )}
    href={`https://linkedin.com/in/${employee.linkedin}`}
    target='_blank'>
    {employee.ava ? (
      <Image
        alt=''
        className='mb-2 rounded-full group-hover:translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-xl'
        height={70}
        onError={e => (e.currentTarget.srcset = '/ava.png')}
        src={employee.ava}
        width={70}
      />
    ) : (
      <Image
        alt=''
        className='mb-2 rounded-full group-hover:translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-xl'
        height={70}
        src='/ava.png'
        width={70}
      />
    )}
    {employee.star ? (
      <div className='absolute -top-2 left-9 group-hover:-translate-x-1 group-hover:-translate-y-1'>
        <Blink />
      </div>
    ) : null}
    <p
      className={cn(
        'font-semibold group-hover:font-bold group-hover:tracking-tight',
        clamp && 'line-clamp-1'
      )}>
      {employee.name}
    </p>
    <p className={cn('text-pretty text-center text-sm', clamp && 'line-clamp-2')}>
      {employee.title || ''}
    </p>
  </Link>
)

export default Avatar
