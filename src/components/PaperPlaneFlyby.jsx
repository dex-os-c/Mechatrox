import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import PaperPlaneModel from '../three/PaperPlaneModel'

const CYCLE_S = 7

function FlyingPlane({ reduceMotion }) {
  const group = useRef()
  const { viewport } = useThree()

  useFrame((state) => {
    if (!group.current) return
    const elapsed = state.clock.elapsedTime
    const cycleIndex = Math.floor(elapsed / CYCLE_S)
    const t = (elapsed % CYCLE_S) / CYCLE_S // 0 -> 1 across this pass
    const goingRight = cycleIndex % 2 === 0 // alternate direction each pass

    const halfW = viewport.width / 2 + 1.4
    const startX = goingRight ? -halfW : halfW
    const endX = goingRight ? halfW : -halfW
    const x = startX + (endX - startX) * t

    // A gentle arc (rises then dips) plus a couple of playful bobs along
    // the pass, rather than a flat straight-line crossing.
    const baseY = viewport.height * 0.16
    const y = baseY + Math.sin(t * Math.PI) * (viewport.height * 0.22) + Math.sin(t * Math.PI * 5) * 0.12

    group.current.position.set(x, y, 0)
    group.current.rotation.y = goingRight ? -Math.PI / 2.3 : Math.PI - Math.PI / 2.3
    group.current.rotation.x = -0.18 + Math.sin(t * Math.PI) * 0.1
    group.current.rotation.z = reduceMotion ? 0 : Math.sin(t * Math.PI * 5) * 0.14
  })

  return (
    <group ref={group} scale={0.62}>
      <PaperPlaneModel />
    </group>
  )
}

// Fixed, full-viewport, click-through overlay -- the plane crosses
// whatever's currently on screen rather than being tied to a scroll
// position. z-20 sits above ordinary page content (which sits at z-10,
// see the note in Hero.jsx about the persistent robot's stacking order)
// but below the navbar (z-50) and modals (z-100).
export default function PaperPlaneFlyby() {
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return null // a plane sweeping the whole screen every 7s is exactly what this setting exists to suppress

  return (
    <div className="fixed inset-0 z-20 pointer-events-none" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 10], fov: 34 }} dpr={[1, 1.5]} gl={{ alpha: true }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 4, 5]} intensity={1.15} />
        <pointLight position={[-2, 1, 3]} color="#D9A441" intensity={0.8} />
        <Suspense fallback={null}>
          <FlyingPlane reduceMotion={reduceMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}
