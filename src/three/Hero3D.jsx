import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

const COPPER = '#C97A4A'
const GOLD = '#D9A441'

// Cycle order for the idle loop — TPose is deliberately excluded, it's a rig
// reference pose, not something you'd want playing on a live hero section.
const CYCLE_CLIPS = ['Idle', 'Walk', 'Run']
const CYCLE_MS = 5000

// Soldier.glb's rest pose faces the opposite way round from the old
// RobotExpressive model, so the same small -0.5 yaw that used to read as a
// pleasant 3/4 turn toward camera instead showed its back. Base yaw here is
// flipped 180° from that, then nudged the same -0.5 for the same 3/4 angle.
const BASE_YAW = Math.PI - 0.5

export function RobotModel() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/Soldier.glb')
  const { actions, names } = useAnimations(animations, group)
  const { pointer, viewport } = useThree()
  const currentRef = useRef(null)
  const cycleIndexRef = useRef(0)

  // Height-based, not max(x,y,z) — this model's bind pose has a slung rifle
  // that reaches wider than the body is tall, so using the widest axis
  // under-scales the actual on-screen character. Height is the one
  // dimension that's stable across the whole animation set.
  const modelHeight = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    return box.getSize(new THREE.Vector3()).y || 1
  }, [scene])

  // Positioned relative to the camera's actual visible frustum (viewport,
  // in three.js world units) instead of fixed coordinates. A fixed
  // position={[1.15, ...]} was tuned for a wide desktop frustum; on a
  // narrow portrait phone the same camera's horizontal FOV covers a much
  // smaller slice of world space, so that fixed x sat right at — or past —
  // the edge, showing only a cropped, close-up sliver of the model.
  const targetHeight = viewport.height * (viewport.width < 3.4 ? 0.6 : 0.82)
  const scale = targetHeight / modelHeight
  const halfBodyWidth = 0.45 * scale // rough shoulder-to-shoulder half-width at this scale
  const x = Math.min(viewport.width * 0.28, viewport.width / 2 - halfBodyWidth - 0.1)
  // Anchored a bit further up from the very bottom of the frustum than a
  // pure feet-at-the-floor placement — reads as "standing in frame" rather
  // than "sinking below the fold" behind the hero copy/CTAs.
  const y = -viewport.height / 2 + (viewport.width < 3.4 ? 0.75 : 0.4)

  const play = (clipName) => {
    const clip = names.includes(clipName) ? clipName : names[0]
    const next = actions[clip]
    if (!next || clip === currentRef.current) return
    const prev = currentRef.current
    if (prev && actions[prev]) actions[prev].fadeOut(0.5)
    // Run gets a touch of extra playback speed — at the clip's native rate
    // it reads as barely different from Walk from a static hero camera.
    next.timeScale = clip === 'Run' ? 1.2 : 1
    next.reset().fadeIn(0.5).play()
    currentRef.current = clip
  }

  useEffect(() => {
    if (!names.length) return undefined
    cycleIndexRef.current = 0
    play(CYCLE_CLIPS[0])

    // Auto-cycle through the animation set every 5s — no click needed.
    const interval = window.setInterval(() => {
      cycleIndexRef.current = (cycleIndexRef.current + 1) % CYCLE_CLIPS.length
      play(CYCLE_CLIPS[cycleIndexRef.current])
    }, CYCLE_MS)

    return () => {
      window.clearInterval(interval)
      if (currentRef.current && actions[currentRef.current]) actions[currentRef.current].fadeOut(0.3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, names])

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = BASE_YAW + pointer.x * 0.3
      // A skeletal Walk/Run clip on a character that never actually
      // translates forward reads as subtle/static from a distance — this
      // layers a small breathing-style bob on top of whatever clip is
      // playing so the hero figure never looks frozen between poses.
      group.current.position.y = y + Math.sin(state.clock.elapsedTime * 1.6) * 0.035
    }
  })

  return (
    <group ref={group} position={[x, y, 0]} scale={scale} rotation={[0, BASE_YAW, 0]}>
      <primitive object={scene} />
    </group>
  )
}
useGLTF.preload('/models/Soldier.glb')

export function NetworkField() {
  const group = useRef()
  const NODE_COUNT = 42

  const { positions, linePositions } = useMemo(() => {
    const pts = []
    for (let i = 0; i < NODE_COUNT; i++) {
      const r = 3.8 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * 0.6,
          r * Math.sin(phi) * Math.sin(theta)
        )
      )
    }
    const positions = new Float32Array(pts.length * 3)
    pts.forEach((p, i) => p.toArray(positions, i * 3))

    const lines = []
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 2.1 && Math.random() > 0.86) {
          lines.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z)
        }
      }
    }
    return { positions, linePositions: new Float32Array(lines) }
  }, [])

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.05
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={GOLD} size={0.045} transparent opacity={0.75} sizeAttenuation />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={COPPER} transparent opacity={0.18} />
      </lineSegments>
    </group>
  )
}
