import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

import { auth } from '@a/auth'
import { ThemeProvider, ThemeToggle } from '@a/ui/theme'
import { TooltipProvider } from '@a/ui/tooltip'

import { TRPCReactProvider } from '~/trpc/react'
import Nav from './nav'
import Translate from './translate'
import User from './user'

import './globals.css'

const sf = localFont({ src: '../asset/SF-Pro.ttf' })

export const metadata: Metadata = {
  description: '',
  icons: '/brick.svg'
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <TRPCReactProvider>
            <TooltipProvider delayDuration={0} disableHoverableContent>
              <SessionProvider session={await auth()}>
                <div className='flex select-none flex-col justify-between border-r p-1.5'>
                  <div className='notranslate grid gap-2'>
                    <Nav />
                  </div>
                  <div className='grid gap-2.5'>
                    <ThemeToggle />
                    <User />
                    <Translate />
                  </div>
                </div>
                <div className='grow overflow-auto'>{children}</div>
              </SessionProvider>
            </TooltipProvider>
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
