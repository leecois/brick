'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, PersonIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'

import { cn } from '@a/ui'
import { buttonVariants } from '@a/ui/button'

interface IconProps extends React.SVGAttributes<SVGElement> {
  children?: never
  color?: string
}

interface NavProps {
  href: string
  icon: React.FC<IconProps>
  title: string
}

const links: NavProps[] = [
  {
    href: '/',
    icon: HomeIcon,
    title: 'Home'
  },
  {
    href: '/profile',
    icon: PersonIcon,
    title: 'Profile'
  }
]

export default function Nav() {
  const pathname: string = usePathname(),
    user = useSession().data?.user,
    visibleLinks = user ? links : links.filter(link => link.href === '/')
  return visibleLinks.map((link, i) => (
    <Link
      className={cn(
        buttonVariants({
          variant: pathname === link.href ? 'default' : 'ghost'
        }),
        'mb-2 w-full justify-start gap-0 rounded-lg px-2 text-muted-foreground drop-shadow-md transition-all duration-500 hover:shadow-md hover:drop-shadow-xl group-hover:h-12 group-hover:gap-2 group-hover:rounded-xl group-hover:pl-3.5',
        pathname === link.href
          ? 'text-background dark:bg-muted dark:text-foreground'
          : 'bg-background'
      )}
      href={link.href}
      key={i}>
      <link.icon className='size-5' />
      <span className='text-[0] transition-all duration-500 group-hover:text-base'>
        {link.title}
      </span>
    </Link>
  ))
}
