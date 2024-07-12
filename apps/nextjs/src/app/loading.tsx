'use client'

import Image from 'next/image'

import Loop from '~/components/loop'

const Page = () => (
  <div className='flex h-screen'>
    <div className='m-auto'>
      <Image alt='' height={300} src='/globe.gif' unoptimized width={300} />
      <Loop
        className='flex select-none justify-center gap-1.5 text-3xl'
        texts={[
          '🌐 Getting ready',
          '🚀 Almost there',
          '🕒 Just a moment',
          '🛑 Hold on',
          '🔄 Loading',
          '⏳ Just a sec'
        ]}>
        <p className='animate-bounce rounded-full [animation-delay:-0.3s]'>.</p>
        <p className='animate-bounce rounded-full [animation-delay:-0.15s]'>.</p>
        <p className='animate-bounce rounded-full'>.</p>
      </Loop>
    </div>
  </div>
)

export default Page
