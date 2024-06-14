import { Button } from '@a/ui/button'

interface FillInputProps {
  list: string[]
  inputId: string
}

const FillInput = ({ list, inputId }: FillInputProps) =>
  list.length ? (
    <div className='mt-2 flex flex-col'>
      {list.map((k, i) => (
        <Button
          onClick={() => {
            const inputArea = document.getElementById(inputId) as HTMLInputElement
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              'value'
            )?.set?.bind(inputArea)
            nativeInputValueSetter?.(k)
            const ev = new Event('input', { bubbles: true })
            inputArea.dispatchEvent(ev)
          }}
          key={i}
          variant='ghost'
          className='notranslate justify-start font-normal'>
          {k}
        </Button>
      ))}
    </div>
  ) : null

export default FillInput
