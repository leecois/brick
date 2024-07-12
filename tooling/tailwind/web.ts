/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Config } from 'tailwindcss'
import extendedShadowsPlugin from 'tailwind-extended-shadows'
import animate from 'tailwindcss-animate'

import base from './base'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addVariablesForColors = ({ addBase, theme }: any) => {
    const allColors = flattenColorPalette(theme('colors')),
      newVars = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
      )
    addBase({ ':root': newVars })
  }

export default {
  content: base.content,
  plugins: [animate, extendedShadowsPlugin, addVariablesForColors],
  presets: [base],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        fifth: 'moveInCircle 20s ease infinite',
        first: 'moveVertical 30s ease infinite',
        fourth: 'moveHorizontal 40s ease infinite',
        'meteor-effect': 'meteor 5s linear infinite',
        scroll:
          'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        second: 'moveInCircle 20s reverse infinite',
        third: 'moveInCircle 40s linear infinite'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'caret-blink': { '0%,70%,100%': { opacity: '1' }, '20%,50%': { opacity: '0' } },
        meteor: {
          '0%': { opacity: '1', transform: 'rotate(215deg) translateX(0)' },
          '100%': { opacity: '0', transform: 'rotate(215deg) translateX(-500px)' },
          '70%': { opacity: '1' }
        },
        moveHorizontal: {
          '0%': { transform: 'translateX(-50%) translateY(-10%)' },
          '100%': { transform: 'translateX(-50%) translateY(-10%)' },
          '50%': { transform: 'translateX(50%) translateY(10%)' }
        },
        moveInCircle: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
          '50%': { transform: 'rotate(180deg)' }
        },
        moveVertical: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(-50%)' },
          '50%': { transform: 'translateY(50%)' }
        },
        scroll: { to: { transform: 'translate(calc(-50% - 0.5rem))' } }
      },
      minHeight: {
        '1/2': '50svh',
        '1/4': '25svh',
        '128': '32rem',
        '2/3': '66svh',
        '3/4': '75svh'
      },
      minWidth: {
        '1/2': '50svh',
        '1/4': '25svh',
        '128': '32rem',
        '2/3': '66svh',
        '3/4': '75svh'
      }
    }
  }
} satisfies Config
