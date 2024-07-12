'use client'

import type { MotionValue, SpringOptions } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

import { cn } from '@a/ui'

interface MouseMoveEvent {
  clientX: number
  clientY: number
}
const smoothOptions: SpringOptions = {
  damping: 20,
  mass: 0.5,
  stiffness: 300
}

export default function Cursor() {
  const [isPressed, setIsPressed] = useState<boolean>(false),
    [isVisible, setIsVisible] = useState(false),
    _mouse: {
      x: MotionValue<number>
      y: MotionValue<number>
    } = {
      x: useMotionValue(0),
      y: useMotionValue(0)
    },
    cursor = useRef<HTMLDivElement>(null),
    cursorSize = isPressed ? 18 : 12,
    handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        return
      }
      setIsPressed(true)
    },
    handleMouseUp = () => setIsPressed(false),
    manageMouseLeave = () => setIsVisible(false),
    manageMouseMove = (e: MouseMoveEvent) => {
      const isFinePointer = window.matchMedia('(pointer: fine)').matches
      if (!isFinePointer) {
        setIsVisible(false)
        return
      }
      if (!isVisible) {
        setIsVisible(true)
      }
      _mouse.x.set(e.clientX - cursorSize / 2)
      _mouse.y.set(e.clientY - cursorSize / 2)
    },
    manageResize = () => {
      const isFinePointer = window.matchMedia('(pointer: fine)').matches
      if (!isFinePointer) {
        setIsVisible(false)
      }
    },
    smoothMouse = {
      x: useSpring(_mouse.x, smoothOptions),
      y: useSpring(_mouse.y, smoothOptions)
    },
    template = ({ rotate, scaleX, scaleY }: { rotate: number; scaleX: number; scaleY: number }) =>
      `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`

  useEffect(() => {
    window.addEventListener('resize', manageResize)
    document.body.addEventListener('mouseleave', manageMouseLeave, { passive: true })
    window.addEventListener('mousemove', manageMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    return () => {
      window.removeEventListener('resize', manageResize)
      window.removeEventListener('mouseleave', manageMouseLeave)
      window.removeEventListener('mousemove', manageMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    motion.div && (
      <motion.div
        animate={{ height: cursorSize, width: cursorSize }}
        className={cn(
          'pointer-events-none fixed size-3.5 rounded-full shadow',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        ref={cursor}
        style={{ left: smoothMouse.x, scaleX: _mouse.x, scaleY: _mouse.y, top: smoothMouse.y }}
        transformTemplate={template}
      />
    )
  )
}
