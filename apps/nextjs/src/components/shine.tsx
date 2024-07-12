import { motion } from 'framer-motion'

import { cn } from '@a/ui'

interface ShineProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly repeatDelay: number
}

const Shine = ({ children, className, repeatDelay }: ShineProps) =>
  motion.div && (
    <motion.div
      animate={
        { '--x': '-100%' } as {
          '--x': string
          scale: number
        }
      }
      className={cn('radial-gradient linear-mask', className)}
      initial={
        { '--x': '100%', scale: 1 } as {
          '--x': string
          scale: number
        }
      }
      transition={{
        repeat: Infinity,
        repeatDelay,
        stiffness: 10,
        type: 'spring'
      }}>
      {children}
    </motion.div>
  )

export default Shine
