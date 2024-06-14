import { FcGoogle } from 'react-icons/fc'

import { auth, signIn } from '@a/auth'
import { Button } from '@a/ui/button'

import type { Query } from '~/types'
import { env } from '~/env'
import MyTable from './table'

export const maxDuration = 300

export default async function Page() {
  const session = await auth()
  if (!session) {
    return (
      <div className='flex h-screen'>
        <div className='m-auto flex items-center gap-5'>
          <form
            action={async () => {
              'use server'
              await signIn('google')
            }}>
            <Button
              variant='outline'
              size='lg'
              className='h-12 gap-2 text-base drop-shadow-md transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-lg'>
              <FcGoogle className='size-7' />
              Log in with Google
            </Button>
          </form>
        </div>
      </div>
    )
  }
  const url: string = env.ENDPOINT + '/user?user=' + session.user.email
  console.log('GET |', url)

  const history: Query[] = ((await (await fetch(url)).json()) as Query[])
    .map(q => ({ ...q, date: q.date ? new Date(q.date) : null }))
    .sort((a, b) => (a.date && b.date ? b.date.getTime() - a.date.getTime() : 0))

  return <MyTable user={session.user.email ?? ''} history={history} />
}
