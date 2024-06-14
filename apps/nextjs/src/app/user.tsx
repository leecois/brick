import Image from 'next/image'
import { EnterIcon, PersonIcon } from '@radix-ui/react-icons'

import { auth, signIn, signOut } from '@a/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@a/ui/avatar'
import { Button } from '@a/ui/button'
import { Dialog, DialogClose, DialogTrigger } from '@a/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@a/ui/dropdown-menu'

import { DialogContent } from '~/components/dialog'
import Tutip from '~/components/tutip'

export default async function UserButton() {
  const session = await auth()
  return session?.user ? (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none'>
          <Avatar className='mx-auto size-8 transition-all duration-300 hover:scale-110 hover:drop-shadow-sm'>
            {session.user.image && (
              <AvatarImage src={session.user.image} alt={session.user.name ?? ''} />
            )}
            <AvatarFallback>{session.user.email}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='m-1.5 grid grid-flow-row'>
          <DropdownMenuItem className='justify-between gap-3'>
            <form
              action={async () => {
                'use server'
                await signIn('google', undefined, {
                  scope: 'openid https://www.googleapis.com/auth/gmail.send'
                })
              }}>
              <button>Grant send email permission</button>
            </form>
            <Image src='/gmail.ico' alt='Gmail' width={20} height={20} />
          </DropdownMenuItem>
          <DialogTrigger>
            <DropdownMenuItem className='justify-between gap-3'>
              Log out
              <EnterIcon className='size-5' />
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className='w-fit p-4'>
        {'Are you sure you want to log out of ' + session.user.email + '?'}
        <div className='flex justify-end gap-3'>
          <DialogClose>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <form
            action={async () => {
              'use server'
              await signOut()
            }}>
            <Button variant='destructive'>Sign Out</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <form
      action={async () => {
        'use server'
        await signIn('google')
      }}>
      <Tutip content='Log in with Google' side='right'>
        <Button
          variant='ghost'
          size='icon'
          className='group size-9 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg'>
          <PersonIcon className='size-6 transition-all duration-300 group-hover:scale-0' />
          <EnterIcon className='absolute size-6 scale-0 transition-all duration-300 group-hover:scale-100' />
        </Button>
      </Tutip>
    </form>
  )
}
