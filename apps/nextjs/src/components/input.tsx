'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

import { cn } from '@a/ui'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const color = 'orange-400',
      [visible, setVisible] = useState(false),
      mouseX = useMotionValue(0),
      mouseY = useMotionValue(0),
      radius = 150
    // Of hover effect

    return (
      motion.div && (
        <motion.div
          className='group/input rounded-md px-[1.5px] py-px transition duration-300'
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          onMouseMove={({ clientX, clientY, currentTarget }: React.MouseEvent<HTMLDivElement>) => {
            const { left, top } = currentTarget.getBoundingClientRect()
            mouseX.set(clientX - left)
            mouseY.set(clientY - top)
          }}
          style={{
            background: useMotionTemplate`radial-gradient(${visible ? `${radius}px` : '0px'} circle at ${mouseX}px ${mouseY}px, var(--${color}), transparent 80%)`
          }}>
          <input
            className={cn(
              'flex h-9 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black shadow-input transition duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] dark:placeholder:text-neutral-600',
              className
            )}
            ref={ref}
            type={type}
            {...props}
          />
        </motion.div>
      )
    )
  }
)
Input.displayName = 'Input'

export { Input }
