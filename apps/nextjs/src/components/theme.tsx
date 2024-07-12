'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

import { Button } from '@a/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@a/ui/dropdown-menu'

export default function ThemeToggle() {
  const { setTheme, theme, themes } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='notranslate w-full justify-start gap-0 rounded-3xl px-0.5 text-[0] capitalize text-muted-foreground transition-all duration-500 *:size-8 *:text-muted-foreground *:transition-all *:duration-1000 hover:drop-shadow-lg *:hover:text-foreground focus-visible:ring-0 group-hover:h-10 group-hover:gap-2 group-hover:pl-1 group-hover:pr-3 group-hover:text-base'
          variant='ghost'>
          <SunIcon className='rotate-0 scale-110 group-hover:rotate-180 group-hover:scale-95 dark:-rotate-180 dark:scale-0 dark:group-hover:scale-0' />
          <MoonIcon className='absolute rotate-180 scale-0 group-hover:rotate-180 dark:rotate-0 dark:scale-110 dark:group-hover:scale-95' />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='mx-2 my-1 capitalize transition-all duration-300 hover:drop-shadow-xl'
        side='right'>
        <DropdownMenuRadioGroup className='notranslate' onValueChange={setTheme} value={theme}>
          {themes.map(t => (
            <DropdownMenuRadioItem key={t} value={t}>
              {t}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
