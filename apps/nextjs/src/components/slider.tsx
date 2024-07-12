import { forwardRef, Fragment, useEffect, useState } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@a/ui'

export interface SliderProps {
  readonly className?: string
  readonly max: number
  readonly min: number
  readonly minStepsBetweenThumbs: number
  readonly onValueChange?: (values: [number, number]) => void
  readonly step: number
  readonly value?: [number, number]
}

const Slider = forwardRef(
  ({ className, max, min, onValueChange, step, value, ...props }: SliderProps, ref) => {
    const [localValues, setLocalValues] = useState(Array.isArray(value) ? value : [min, max]),
      handleValueChange = (newValues: [number, number]) => {
        setLocalValues(newValues)
        if (onValueChange) {
          onValueChange(newValues)
        }
      }
    useEffect(() => setLocalValues(Array.isArray(value) ? value : [min, max]), [min, max, value])
    return (
      <SliderPrimitive.Root
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        max={max}
        min={min}
        onValueChange={handleValueChange}
        ref={ref as React.RefObject<HTMLDivElement>}
        step={step}
        value={localValues}
        {...props}>
        <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
          <SliderPrimitive.Range className='absolute h-full bg-primary' />
        </SliderPrimitive.Track>
        {localValues.map((v, i) => (
          <Fragment key={i}>
            <SliderPrimitive.Thumb className='block size-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' />
          </Fragment>
        ))}
      </SliderPrimitive.Root>
    )
  }
)

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
