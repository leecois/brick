import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { Provider } from 'jotai'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

import { auth } from '@a/auth'

import Cursor from '~/components/cursor'
import ThemeToggle from '~/components/theme'
import { TRPCReactProvider } from '~/trpc/react'
import Nav from './nav'
import Translate from './translate'
import UserButton from './user-button'

import './globals.css'

const sf = localFont({ src: 'SF-Pro.ttf' })

export const metadata: Metadata = {
  description: '',
  icons: '/brick.svg'
}

export const viewport: Viewport = {
  themeColor: [
    { color: 'white', media: '(prefers-color-scheme: light)' },
    { color: 'black', media: '(prefers-color-scheme: dark)' }
  ]
}

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const session = await auth(),
    user = session?.user
  return (
    <html lang='en' suppressHydrationWarning>
      <title>Brick AI</title>
      <body
        className={`flex min-h-screen bg-background tracking-[-0.039em] text-foreground antialiased ${sf.className}`}>
        <Script src='/translate.js' strategy='beforeInteractive' />
        <Script
          src='//translate.google.com/translate_a/element.js?cb=TranslateInit'
          strategy='afterInteractive'
        />
        <Provider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <TRPCReactProvider>
              <SessionProvider session={session}>
                <div className='group flex w-[50px] select-none flex-col justify-between border-r transition-all duration-500 *:px-1.5 hover:w-40 hover:p-1.5'>
                  <div className='z-[1001] rounded-md bg-background pt-1.5 group-hover:space-y-1.5'>
                    <Nav />
                  </div>
                  <div className='group-hover:space-y-2'>
                    <Translate />
                    {user ? <UserButton user={user} /> : null}
                    <ThemeToggle />
                  </div>
                </div>
                <div className='grow overflow-auto'>{children}</div>
              </SessionProvider>
            </TRPCReactProvider>
            <Toaster />
            <Cursor />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}
