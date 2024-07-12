import type { SIDE_OPTIONS } from '@radix-ui/react-popper'

import { cn } from '@a/ui'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@a/ui/hover-card'

interface TutipProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly closeDelay?: number
  readonly content?: string
  readonly openDelay?: number
  readonly side: (typeof SIDE_OPTIONS)[number]
}

const Tutip = ({
  children,
  className,
  closeDelay = 100,
  content,
  openDelay = 0,
  side
}: TutipProps) =>
  content ? (
    <HoverCard closeDelay={closeDelay} openDelay={openDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className={cn(
          'w-fit border-muted-foreground px-2.5 py-1 capitalize shadow-none',
          className
        )}
        side={side}>
        {content}
      </HoverCardContent>
    </HoverCard>
  ) : (
    children
  )

export default Tutip
