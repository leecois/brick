import type { StaticImageData } from 'next/image'
import type { MutableRefObject } from 'react'
import type { InstancedMesh, Vector3Like } from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { ImageLoader, Object3D, Vector2, Vector3 } from 'three'

import map from '~/asset/globe.png'

const centerVector = new Vector3(0, 0, 0)
const tempObject = new Object3D()

const getDistance = (circlePosition: Vector3Like) => {
  const distance = new Vector3()
  distance.subVectors(centerVector, circlePosition).normalize()
  const { x, y, z } = distance
  const cordX = 1 - (0.5 + Math.atan2(z, x) / (2 * Math.PI))
  const cordY = 0.5 + Math.asin(y) / Math.PI
  return new Vector2(cordX, cordY)
}
const getAlpha = (distanceVector: Vector2, imgData: ImageData) => {
  const { width, height } = imgData
  const { x, y } = distanceVector
  const index = 4 * Math.floor(x * width) + Math.floor(y * height) * (4 * width)
  return imgData.data[index + 3]
}
const getImageData = (image: HTMLImageElement) => {
  const ctx = document.createElement('canvas')
  ctx.width = image.width
  ctx.height = image.height
  const canvas = ctx.getContext('2d')
  if (canvas) {
    canvas.drawImage(image, 0, 0)
    return canvas.getImageData(0, 0, ctx.width, ctx.height)
  }
  return null
}

interface DotsProps {
  count: number
  radius: number
  dotRadius: number
}

const Dots = ({ count, radius, dotRadius }: DotsProps) => {
  const ref = useRef<InstancedMesh>()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const mapElement = useLoader(ImageLoader, (map as StaticImageData).src) as HTMLImageElement

  useEffect(() => {
    const imageData = getImageData(mapElement)

    for (let b = 0; b < count; b++) {
      const phi = Math.acos(-1 + (2 * b) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      const { x, y, z } = new Vector3(0, 0, 0).setFromSphericalCoords(radius, phi, theta)

      tempObject.lookAt(centerVector)
      tempObject.position.set(x, y, z)
      const distanceVector = getDistance({ x, y, z })
      const alpha = imageData ? getAlpha(distanceVector, imageData) : null

      if (alpha && alpha > 0) {
        tempObject.updateMatrix()
        ref.current?.setMatrixAt(b, tempObject.matrix)
      }
    }
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true
    }
  }, [mapElement, count, radius])

  return (
    <instancedMesh
      ref={ref as MutableRefObject<InstancedMesh>}
      args={[undefined, undefined, count]}>
      <circleGeometry args={[dotRadius]} />
      <meshPhongMaterial side={2} color='#0b0' />
    </instancedMesh>
  )
}

interface GlobeProps {
  radius?: number
  className?: string
}

const Globe = ({ radius = 10, className }: GlobeProps) => (
  <div className={className}>
    <Canvas camera={{ position: [0, 0, radius * 1.69] }}>
      <ambientLight />
      <mesh castShadow>
        <sphereGeometry args={[radius]} />
        <meshPhongMaterial transparent color='#7ff' />
      </mesh>
      <Dots count={1000 * radius} radius={radius * 1.01} dotRadius={radius / 50} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={12}
        rotateSpeed={0.2}
        enablePan={false}
        enableZoom={false}
      />
    </Canvas>
  </div>
)

export default Globe
