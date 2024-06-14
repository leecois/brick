import Image from 'next/image'

import type { Source } from '~/types'

const Logo = ({ source, size }: { source: Source; size: number }) => (
  <Image
    src={'/' + source + (source === 'linkedin' ? '.svg' : '.ico')}
    alt={source}
    width={size}
    height={size}
  />
)

export default Logo
