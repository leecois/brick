import { motion } from 'framer-motion'

const Shine = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ '--x': '100%', scale: 1 } as { '--x': string; scale: number }}
    animate={{ '--x': '-100%' } as { '--x': string; scale: number }}
    transition={{
      repeat: Infinity,
      repeatDelay: -2.5,
      type: 'spring',
      stiffness: 10
    }}
    className='radial-gradient linear-mask'>
    {children}
  </motion.div>
)

export default Shine
