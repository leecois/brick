import { motion } from 'framer-motion'

const Hover = ({ className }: { readonly className?: string }) =>
  motion.div && (
    <motion.div
      animate={{ opacity: 1, transition: { duration: 0.15 } }}
      className={className}
      exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.15 } }}
      initial={{ opacity: 0 }}
      layoutId='hoverBackground'
    />
  )

export default Hover
