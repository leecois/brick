import { cn } from '@a/ui'
import { Button } from '@a/ui/button'

interface FillInputProps {
  readonly className?: string
  readonly inputId: string
  readonly list: string[]
}

const FillInput = ({ className, inputId, list }: FillInputProps) =>
  list.length
    ? list.map((k, i) => (
        <Button
          className={cn('notranslate w-full justify-start font-normal', className)}
          key={i}
          onClick={() => {
            const input = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement
            try {
              const setter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
              )?.set?.bind(input)
              setter?.(k)
            } catch {
              const setter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
              )?.set?.bind(input)
              setter?.(k)
            }
            input.dispatchEvent(new Event('input', { bubbles: true }))
          }}
          variant='ghost'>
          {k}
        </Button>
      ))
    : null

export default FillInput
