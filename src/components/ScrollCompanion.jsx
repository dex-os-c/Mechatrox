import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import CompanionRobot from '../three/CompanionRobot'

// Pops out of the hero once you start scrolling, then rides the right edge
// of the screen -- the real robot.glb model in a small always-on 3D stage,
// playing its Jump clip while scrolling down and WalkJump (a bounding,
// reach-y motion standing in for "climbing") while scrolling back up.
export default function ScrollCompanion() {
  const trackRef = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef(null)
  const lastScrollTopRef = useRef(0)
  const idleTimerRef = useRef(null)

  const [visible, setVisible] = useState(false)
  const [entered, setEntered] = useState(false)
  const [mode, setMode] = useState('idle') // 'down' | 'up' | 'idle'

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const computeTarget = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      targetRef.current = pct

      const dy = doc.scrollTop - lastScrollTopRef.current
      if (Math.abs(dy) > 1) setMode(dy > 0 ? 'down' : 'up')
      lastScrollTopRef.current = doc.scrollTop

      if (!visible && doc.scrollTop > 80) setVisible(true)

      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => setMode('idle'), 260)
    }

    const onScroll = () => computeTarget()
    computeTarget()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const tick = () => {
      const track = trackRef.current
      if (track) {
        const lerpAmt = reduceMotion ? 1 : 0.09
        currentRef.current += (targetRef.current - currentRef.current) * lerpAmt
        const lane = window.innerHeight - 190
        const top = 90 + currentRef.current * lane
        track.style.transform = `translateY(${top}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(idleTimerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (!visible) return undefined
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [visible])

  return (
    <div
      ref={trackRef}
      className={`scroll-companion ${entered ? 'is-entered' : 'is-pre-entrance'}`}
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="scroll-companion-stage">
        <Canvas
          camera={{ position: [0, 0.15, 3.15], fov: 28 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 3, 2]} intensity={1.1} />
          <pointLight position={[-1.5, 1, 1.5]} color="#D9A441" intensity={1.2} />
          <Suspense fallback={null}>
            <CompanionRobot mode={mode} />
          </Suspense>
        </Canvas>
      </div>

      <style>{`
        .scroll-companion{
          position: fixed;
          right: max(4px, env(safe-area-inset-right, 0px));
          top: 0;
          left: auto;
          z-index: 45;
          pointer-events: none;
          transition: opacity .3s ease;
          will-change: transform;
        }

        .scroll-companion-stage{ width: 92px; height: 118px; }
        @media (max-width: 480px){
          .scroll-companion-stage{ width: 66px; height: 86px; }
        }

        .scroll-companion.is-pre-entrance .scroll-companion-stage{
          transform: translate(16px, -44px) scale(0.35);
          opacity: 0;
        }
        .scroll-companion.is-entered .scroll-companion-stage{
          animation: sc-jump-out .6s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes sc-jump-out{
          0%{ transform: translate(16px, -44px) scale(0.35); opacity: 0; }
          55%{ transform: translate(-4px, 6px) scale(1.06); opacity: 1; }
          100%{ transform: translate(0, 0) scale(1); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce){
          .scroll-companion.is-pre-entrance .scroll-companion-stage,
          .scroll-companion.is-entered .scroll-companion-stage{ animation: none; transform: none; opacity: 1; }
        }
      `}</style>
    </div>
  )
}
