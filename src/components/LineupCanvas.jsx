import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ICONS } from '../three/EventIcons'

function RotatingGroup({ children }) {
  const ref = useRef()
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += (reduceMotion ? 0.06 : 0.28) * delta
  })
  return <group ref={ref}>{children}</group>
}

// Split out from Lineup.jsx so three.js + @react-three/fiber only load in
// this chunk, dynamically imported by Lineup via React.lazy.
export default function LineupCanvas({ activeKey }) {
  const ActiveIcon = ICONS[activeKey]
  return (
    <Canvas camera={{ position: [1.7, 1.3, 2.6], fov: 40 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 2]} intensity={0.9} />
      <Suspense fallback={null}>
        <RotatingGroup>
          <ActiveIcon />
        </RotatingGroup>
      </Suspense>
    </Canvas>
  )
}
