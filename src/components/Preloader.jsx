import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, useProgress } from '@react-three/drei'
import * as THREE from 'three'

// Same robot.glb used in Hero — a real, freely-licensed model (RobotExpressive
// by Tomás Laulhé, CC0), not something built for this preloader. Framed close
// and playing its own 'Wave' clip once, so the hand/arm motion is the focus.
// Firing useGLTF() here also means the fetch starts the instant the page
// loads, well before Hero's own lazy chunk — so by the time Hero mounts,
// the browser already has robot.glb cached and its own robot appears instantly.
function PreloaderRobot({ onWaveDone }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/robot.glb')
  const { actions, names } = useAnimations(animations, group)
  const { viewport } = useThree()
  const firedRef = useRef(false)

  // Same responsive-sizing approach as Hero3D's RobotModel: measure the
  // model's real bounding-box height and fit it to a fraction of the
  // *actual visible viewport* (in three.js world units) instead of a
  // hardcoded scale number. A fixed scale only ever looks right on
  // whichever single aspect ratio it was eyeballed on — which is exactly
  // what made this render small/off-frame on a real phone.
  const modelHeight = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    return box.getSize(new THREE.Vector3()).y || 1
  }, [scene])
  const targetHeight = viewport.height * 0.95
  const scale = targetHeight / modelHeight

  useEffect(() => {
    if (!names.length) return undefined
    const clip = names.includes('Wave') ? 'Wave' : names[0]
    const action = actions[clip]
    if (!action) return undefined

    action.reset().setLoop(THREE.LoopOnce, 1)
    action.clampWhenFinished = true
    action.play()

    const finish = () => {
      if (firedRef.current) return
      firedRef.current = true
      onWaveDone?.()
    }
    const mixer = action.getMixer()
    const onFinished = (e) => { if (e.action === action) finish() }
    mixer.addEventListener('finished', onFinished)
    // Safety: if the 'finished' event is ever missed, don't strand the preloader.
    const safety = setTimeout(finish, 2600)

    return () => {
      mixer.removeEventListener('finished', onFinished)
      clearTimeout(safety)
    }
  }, [actions, names, onWaveDone])

  return (
    <group ref={group} position={[0, -targetHeight / 2 + targetHeight * 0.08, 0]} scale={scale} rotation={[0, -0.4, 0]}>
      <primitive object={scene} />
    </group>
  )
}
useGLTF.preload('/models/robot.glb')

function LoadWatcher({ onReady, onProgress }) {
  const { progress, active } = useProgress()
  const firedRef = useRef(false)
  useEffect(() => {
    onProgress?.(progress)
    if (!firedRef.current && !active && progress >= 100) {
      firedRef.current = true
      onReady?.()
    }
  }, [active, progress, onReady, onProgress])
  return null
}

export default function Preloader({ onDone }) {
  // boot -> reveal (robot waves in) -> exit (fades/scales out) -> onDone
  const [phase, setPhase] = useState('boot')
  const [pct, setPct] = useState(0)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onDone?.()
  }

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(finish, 550)
      return () => clearTimeout(t)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    // Absolute fallback: never leave the user staring at a frozen loader,
    // no matter which phase it's stuck in or why.
    const fallback = setTimeout(finish, 6500)
    return () => clearTimeout(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${phase === 'exit' ? 'scale-110' : 'scale-100'}`}
      style={{
        background: 'var(--pcb-0)',
        opacity: phase === 'exit' ? 0 : 1,
        visibility: doneRef.current ? 'hidden' : 'visible',
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0.35, 3.1], fov: 32 }} dpr={[1, 1.6]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 2]} intensity={1} />
          <pointLight position={[-2, 1, 2]} color="#D9A441" intensity={2} />
          <pointLight position={[2, -0.5, -1.5]} color="#C97A4A" intensity={1.1} />
          <Suspense fallback={null}>
            {phase !== 'boot' && (
              <PreloaderRobot onWaveDone={() => setPhase((p) => (p === 'reveal' ? 'exit' : p))} />
            )}
          </Suspense>
          {/* Outside the Suspense boundary on purpose — if it were inside, mounting it
              would be deferred by the very suspend (GLTF fetch) it's meant to be
              watching, so progress would never update until loading was already done. */}
          <LoadWatcher
            onReady={() => setPhase((p) => (p === 'boot' ? 'reveal' : p))}
            onProgress={(p) => setPct(Math.floor(p))}
          />
        </Canvas>
      </div>

      <div className="relative text-center px-6">
        <div
          className="overflow-hidden transition-all duration-700"
          style={{ maxHeight: phase === 'boot' ? 0 : 120, opacity: phase === 'boot' ? 0 : 1 }}
        >
          <div
            className="font-bold leading-none"
            style={{
              fontSize: 'clamp(40px, 11vw, 96px)',
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              transform: phase === 'boot' ? 'translateY(30px)' : 'translateY(0)',
              transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            MECHA<span style={{ color: 'var(--gold)' }}>TROX</span>
          </div>
          <div
            className="mx-auto mt-3 h-px"
            style={{
              background: 'var(--gold)',
              width: phase === 'boot' ? '0%' : '120px',
              transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s',
            }}
          />
        </div>

        <div
          className="mt-24 md:mt-28 transition-opacity duration-300"
          style={{ opacity: phase === 'boot' ? 1 : 0 }}
        >
          <div className="font-mono text-[13px] tracking-[0.3em] mb-5" style={{ color: 'var(--ink-dim)' }}>
            BOOTING MECHATROX
          </div>
          <div className="w-56 h-[2px] mx-auto" style={{ background: 'var(--line-bright)' }}>
            <div className="h-full" style={{ width: `${pct}%`, background: 'var(--gold)', transition: 'width .15s linear' }} />
          </div>
          <div className="font-mono text-xs mt-3" style={{ color: 'var(--copper-bright)' }}>
            {String(pct).padStart(2, '0')}%
          </div>
        </div>
      </div>
    </div>
  )
}
