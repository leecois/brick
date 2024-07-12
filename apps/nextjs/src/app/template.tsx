'use client'

import { motion } from 'framer-motion'

const Template = ({ children }: { readonly children: React.ReactNode }) =>
  motion.div && (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}>
      {children}
    </motion.div>
  )

export default Template
