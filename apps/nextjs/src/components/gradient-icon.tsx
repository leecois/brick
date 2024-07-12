import React from 'react'

interface Stop {
  color: string
  offset?: number
  opacity?: number
}

interface GradientIconProps {
  readonly className?: string
  readonly rotateGradient?: number
  readonly stops: Stop[]
}

interface GradientIconParentProps extends GradientIconProps {
  readonly children: React.ReactNode
  readonly sourceSvgHeight?: number
  readonly sourceSvgWidth?: number
}

export default function GradientIcon({
  children,
  className,
  rotateGradient,
  sourceSvgHeight = 24,
  sourceSvgWidth = 24,
  stops
}: GradientIconParentProps): JSX.Element {
  const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`
  return (
    <svg
      className={className}
      fill={`url(#${gradientId})`}
      viewBox={`0 0 ${sourceSvgWidth} ${sourceSvgHeight}`}
      xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient
          gradientTransform={`rotate(${rotateGradient ?? 25})`}
          id={gradientId}
          x1='0%'
          x2='100%'
          y1='0%'
          y2='0%'>
          {stops.map((stop, i) => (
            <stop
              key={i}
              offset={
                stop.offset
                  ? `${stop.offset}%`
                  : i === 0
                    ? '0%'
                    : i === stops.length
                      ? '100%'
                      : `${i * (100 / (stops.length - 1))}%`
              }
              style={{
                stopColor: stop.color,
                stopOpacity: stop.opacity ? stop.opacity : 1
              }}
            />
          ))}
        </linearGradient>
      </defs>
      {children}
    </svg>
  )
}
