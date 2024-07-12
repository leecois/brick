import type { User } from 'next-auth'
import Image from 'next/image'
import { EnterIcon } from '@radix-ui/react-icons'

import { signIn, signOut } from '@a/auth'
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

const UserButton = ({ user }: { readonly user: User }) => (
  <Dialog>
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='focus:outline-none'>
        <Button
          className='w-full justify-start gap-0 rounded-3xl p-0 text-[0] text-muted-foreground transition-all duration-500 hover:drop-shadow-lg focus-visible:ring-0 group-hover:h-10 group-hover:gap-2 group-hover:pl-0.5 group-hover:pr-3 group-hover:text-base'
          variant='ghost'>
          <Avatar className='ml-px size-[34px]'>
            {user.image ? <AvatarImage src={user.image} /> : null}
            <AvatarFallback>{user.email}</AvatarFallback>
          </Avatar>
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-2 my-1.5 *:justify-between *:gap-3' side='right'>
        <DropdownMenuItem>
          <form
            action={async () => {
              'use server'
              await signIn('google', undefined, {
                scope: 'openid https://www.googleapis.com/auth/gmail.send'
              })
            }}>
            <button>Grant send email permission</button>
          </form>
          <Image alt='Gmail' height={20} src='/gmail.ico' width={20} />
        </DropdownMenuItem>
        <DialogTrigger asChild>
          <DropdownMenuItem>
            Log out
            <EnterIcon className='size-5' />
          </DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent className='w-fit p-4'>
      {`Are you sure you want to log out of ${user.email}?`}
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
)

export default UserButton
