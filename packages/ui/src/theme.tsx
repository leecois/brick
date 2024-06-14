'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { ThemeProvider, useTheme } from 'next-themes'

import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from './dropdown-menu'

function ThemeToggle() {
  const { themes, setTheme, theme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='group size-9 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg focus-visible:ring-0'>
          <SunIcon className='ml-px size-7 rotate-0 scale-100 text-muted-foreground transition-all duration-1000 hover:text-foreground group-hover:rotate-180 dark:-rotate-180 dark:scale-0' />
          <MoonIcon className='absolute ml-px size-7 rotate-180 scale-0 text-muted-foreground transition-all duration-1000 hover:text-foreground group-hover:rotate-180 dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='mx-2 my-1 capitalize transition-all duration-300 hover:drop-shadow-xl'>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {themes.map(t => (
            <DropdownMenuRadioItem value={t} key={t}>
              {t}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeProvider, ThemeToggle }
