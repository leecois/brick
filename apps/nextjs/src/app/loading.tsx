'use client'

import Globe from '~/components/globe'
import Loop from '~/components/loop'

export default function Page() {
  const texts = [
    '🌐 Getting ready',
    '🚀 Almost there',
    '🕒 Just a moment',
    '🛑 Hold on',
    '🔄 Loading',
    '⏳ Just a sec'
  ]
  return (
    <div className='flex h-screen'>
      <div className='m-auto'>
        <Globe className='h-72' />
        <Loop texts={texts} className='flex select-none justify-center gap-1.5 text-3xl'>
          <p className='animate-bounce rounded-full [animation-delay:-0.3s]'>.</p>
          <p className='animate-bounce rounded-full [animation-delay:-0.15s]'>.</p>
          <p className='animate-bounce rounded-full'>.</p>
        </Loop>
      </div>
    </div>
  )
}
