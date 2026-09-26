import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import PaperPlaneModel from '../three/PaperPlaneModel'

const CYCLE_S = 7

function FlyingPlane({ reduceMotion }) {
  const group = useRef()
  const { viewport } = useThree()
  // Holds the randomised parameters for whichever pass is currently in
  // flight. Re-rolled once per cycle (below), not per-frame -- so the
  // plane's path stays consistent for the full 7s of one pass, but every
  // new pass gets a genuinely different side, altitude, and arc.
  const passRef = useRef({ index: -1, fromRight: false, startY: 0, endY: 0, arcHeight: 0, wobbleSeed: 0 })

  useFrame((state) => {
    if (!group.current) return
    const elapsed = state.clock.elapsedTime
    const cycleIndex = Math.floor(elapsed / CYCLE_S)
    const t = (elapsed % CYCLE_S) / CYCLE_S // 0 -> 1 across this pass

    if (passRef.current.index !== cycleIndex) {
      // New pass starting -- roll fresh randoms for it. Altitude band is
      // biased toward the upper half of the screen (planes flying low
      // through body text reads as a bug, not a feature) but the exact
      // start/end height, which side it starts from, and the arc shape
      // are all randomised independently each time.
      const bandTop = viewport.height * 0.42
      const bandBottom = viewport.height * 0.02
      passRef.current = {
        index: cycleIndex,
        fromRight: Math.random() < 0.5,
        startY: bandBottom + Math.random() * (bandTop - bandBottom),
        endY: bandBottom + Math.random() * (bandTop - bandBottom),
        arcHeight: viewport.height * (0.08 + Math.random() * 0.22),
        wobbleSeed: Math.random() * Math.PI * 2,
      }
    }
    const pass = passRef.current
    const goingRight = !pass.fromRight

    const halfW = viewport.width / 2 + 1.4
    const startX = goingRight ? -halfW : halfW
    const endX = goingRight ? halfW : -halfW
    const x = startX + (endX - startX) * t

    // Straight-line interpolation between this pass's random start/end
    // altitude, plus a rise-then-dip arc and a couple of playful bobs on
    // top -- not a flat crossing at a fixed height every time.
    const y = pass.startY + (pass.endY - pass.startY) * t
      + Math.sin(t * Math.PI) * pass.arcHeight
      + Math.sin(t * Math.PI * 5 + pass.wobbleSeed) * 0.12

    group.current.position.set(x, y, 0)
    // Nose is authored along +X in the model itself (see PaperPlaneModel's
    // comment), so "face right" is 0 and "face left" is a clean 180°
    // mirror-flip -- no arbitrary angles, and the flat dart shape always
    // stays face-on to this camera instead of ever swinging edge-on to it.
    group.current.rotation.y = goingRight ? 0 : Math.PI
    // Small banking wobble around the camera-facing axis (Z) -- rocks the
    // wings side to side like a glider catching air, without ever tipping
    // the flat face away from the camera.
    group.current.rotation.z = reduceMotion ? 0 : Math.sin(t * Math.PI * 5 + pass.wobbleSeed) * 0.18
  })

  return (
    <group ref={group} scale={0.4}>
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
