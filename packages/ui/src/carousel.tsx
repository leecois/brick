'use client'

import type { UseEmblaCarouselType } from 'embla-carousel-react'
import * as React from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import useEmblaCarousel from 'embla-carousel-react'

import { cn } from '@a/ui'

import { Button } from './button'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
  opts?: CarouselOptions
  orientation?: 'horizontal' | 'vertical'
  plugins?: CarouselPlugin
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  api: ReturnType<typeof useEmblaCarousel>[1]
  canScrollNext: boolean
  canScrollPrev: boolean
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  scrollNext: () => void
  scrollPrev: () => void
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null),
  useCarousel = () => {
    const context = React.useContext(CarouselContext)

    if (!context) {
      throw new Error('useCarousel must be used within a <Carousel />')
    }

    return context
  },
  Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
    ({ children, className, opts, orientation = 'horizontal', plugins, setApi, ...props }, ref) => {
      const [carouselRef, api] = useEmblaCarousel(
          {
            ...opts,
            axis: orientation === 'horizontal' ? 'x' : 'y'
          },
          plugins
        ),
        [canScrollPrev, setCanScrollPrev] = React.useState(false),
        [canScrollNext, setCanScrollNext] = React.useState(false),
        onSelect = React.useCallback((_api: CarouselApi) => {
          if (!_api) {
            return
          }

          setCanScrollPrev(_api.canScrollPrev())
          setCanScrollNext(_api.canScrollNext())
        }, []),
        scrollPrev = React.useCallback(() => {
          api?.scrollPrev()
        }, [api]),
        scrollNext = React.useCallback(() => {
          api?.scrollNext()
        }, [api]),
        handleKeyDown = React.useCallback(
          (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              scrollPrev()
            } else if (event.key === 'ArrowRight') {
              event.preventDefault()
              scrollNext()
            }
          },
          [scrollPrev, scrollNext]
        )

      React.useEffect(() => {
        if (!api || !setApi) {
          return
        }

        setApi(api)
      }, [api, setApi])

      React.useEffect(() => {
        if (!api) {
          return
        }

        onSelect(api)
        api.on('reInit', onSelect)
        api.on('select', onSelect)

        return () => {
          api.off('select', onSelect)
        }
      }, [api, onSelect])

      return (
        <CarouselContext.Provider
          value={{
            api,
            canScrollNext,
            canScrollPrev,
            carouselRef,
            opts,
            orientation: opts?.axis === 'y' ? 'vertical' : 'horizontal',
            scrollNext,
            scrollPrev
          }}>
          <div
            aria-roledescription='carousel'
            className={cn('relative', className)}
            onKeyDownCapture={handleKeyDown}
            ref={ref}
            role='region'
            {...props}>
            {children}
          </div>
        </CarouselContext.Provider>
      )
    }
  ),
  CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const { carouselRef, orientation } = useCarousel()

      return (
        <div className='overflow-hidden' ref={carouselRef}>
          <div
            className={cn(
              'flex',
              orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      )
    }
  ),
  CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const { orientation } = useCarousel()

      return (
        <div
          aria-roledescription='slide'
          className={cn(
            'min-w-0 shrink-0 grow-0 basis-full',
            orientation === 'horizontal' ? 'pl-4' : 'pt-4',
            className
          )}
          ref={ref}
          role='group'
          {...props}
        />
      )
    }
  ),
  CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
    ({ className, size = 'icon', variant = 'outline', ...props }, ref) => {
      const { canScrollPrev, orientation, scrollPrev } = useCarousel()

      return (
        <Button
          className={cn(
            'absolute size-8 rounded-full',
            orientation === 'horizontal'
              ? '-left-12 top-1/2 -translate-y-1/2'
              : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
            className
          )}
          disabled={!canScrollPrev}
          onClick={scrollPrev}
          ref={ref}
          size={size}
          variant={variant}
          {...props}>
          <ArrowLeftIcon className='size-4' />
          <span className='sr-only'>Previous slide</span>
        </Button>
      )
    }
  ),
  CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
    ({ className, size = 'icon', variant = 'outline', ...props }, ref) => {
      const { canScrollNext, orientation, scrollNext } = useCarousel()

      return (
        <Button
          className={cn(
            'absolute size-8 rounded-full',
            orientation === 'horizontal'
              ? '-right-12 top-1/2 -translate-y-1/2'
              : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
            className
          )}
          disabled={!canScrollNext}
          onClick={scrollNext}
          ref={ref}
          size={size}
          variant={variant}
          {...props}>
          <ArrowRightIcon className='size-4' />
          <span className='sr-only'>Next slide</span>
        </Button>
      )
    }
  )

export { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious }
CarouselContent.displayName = 'CarouselContent'
Carousel.displayName = 'Carousel'
CarouselItem.displayName = 'CarouselItem'
CarouselNext.displayName = 'CarouselNext'
CarouselPrevious.displayName = 'CarouselPrevious'
