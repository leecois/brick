import Image from 'next/image'

import type { Source } from '~/types'

interface LogoProps {
  readonly className?: string
  readonly size: number
  readonly source: Source
}

const Logo = ({ className, size, source }: LogoProps) => (
  <Image
    alt={source}
    className={className}
    height={size}
    src={`/${source}${source === 'linkedin' ? '.svg' : '.ico'}`}
    width={size}
  />
)

export default Logo
