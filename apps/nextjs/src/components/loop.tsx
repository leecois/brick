import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface LoopProps {
  readonly children?: React.ReactNode
  readonly className?: string
  readonly texts: string[]
}

export default function Loop({ children, className, texts }: LoopProps) {
  const [i, setI] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setI(p => (p < texts.length - 1 ? p + 1 : 0))
    }, 1500)
  }, [])

  return (
    motion.p && (
      <AnimatePresence mode='wait'>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className={className}
          exit={{ opacity: 0, y: -15 }}
          initial={{ opacity: 0, y: 5 }}
          key={i}
          transition={{ duration: 0.3 }}>
          {texts[i]}
          {children}
        </motion.p>
      </AnimatePresence>
    )
  )
}
