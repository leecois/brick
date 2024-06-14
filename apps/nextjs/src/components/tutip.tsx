import type { Side } from '@radix-ui/react-popper'

import { Tooltip, TooltipContent, TooltipTrigger } from '@a/ui/tooltip'

interface TutipProps {
  content: string
  side: Side
  children: React.ReactNode
}

const Tutip = ({ content, side, children }: TutipProps) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent className='capitalize' side={side}>
      {content}
    </TooltipContent>
  </Tooltip>
)

export default Tutip
