import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

const COPPER = '#C97A4A'
const GOLD = '#D9A441'

// Idle plays by default; these are the "fun" poses cycled through on a
// timer instead of waiting for a click.
const FUN_CLIPS = ['Wave', 'ThumbsUp', 'Yes', 'Dance', 'Jump']
const CYCLE_MS = 5000

export function RobotModel() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/robot.glb')
  const { actions, names } = useAnimations(animations, group)
  const { pointer, viewport } = useThree()
  const currentRef = useRef(null)

  // Height, not max(x,y,z) — this is the one dimension that stays stable
  // across this model's whole animation set (Dance/Jump/etc. don't swing an
  // arm out wider than the character is tall the way some rigs do).
  const modelHeight = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    return box.getSize(new THREE.Vector3()).y || 1
  }, [scene])

  // Positioned relative to the camera's actual visible frustum (viewport,
  // in three.js world units) rather than fixed coordinates, so it frames
  // correctly on a narrow/portrait phone instead of just a wide desktop view.
  const targetHeight = viewport.height * (viewport.width < 3.4 ? 0.62 : 0.86)
  const scale = targetHeight / modelHeight
  const halfBodyWidth = 0.42 * scale
  const x = Math.min(viewport.width * 0.28, viewport.width / 2 - halfBodyWidth - 0.1)
  const y = -viewport.height / 2 + (viewport.width < 3.4 ? 0.55 : 0.25)

  const playIdle = () => {
    const idle = names.find((n) => /idle/i.test(n)) || names[0]
    if (idle && actions[idle]) {
      actions[idle].reset().fadeIn(0.4).play()
      currentRef.current = idle
    }
  }

  const playFun = (pick) => {
    const prev = currentRef.current
    const next = actions[pick]
    if (!next || pick === prev) return

    if (prev && actions[prev]) actions[prev].fadeOut(0.25)
    next.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.25).play()
    next.clampWhenFinished = true
    currentRef.current = pick

    const mixer = next.getMixer()
    const onFinished = (e) => {
      if (e.action !== next) return
      mixer.removeEventListener('finished', onFinished)
      next.fadeOut(0.3)
      playIdle()
    }
    mixer.addEventListener('finished', onFinished)
  }

  useEffect(() => {
    if (!names.length) return undefined
    playIdle()

    // Auto-cycle through the fun poses every 5s, no click needed — picks a
    // random one each time (skipping immediate repeats) rather than a fixed
    // order, then eases back to idle when the clip finishes.
    const available = FUN_CLIPS.filter((c) => names.includes(c))
    const interval = window.setInterval(() => {
      if (!available.length) return
      const choices = available.filter((c) => c !== currentRef.current)
      const pick = (choices.length ? choices : available)[Math.floor(Math.random() * (choices.length || available.length))]
      playFun(pick)
    }, CYCLE_MS)

    return () => {
      window.clearInterval(interval)
      if (currentRef.current && actions[currentRef.current]) actions[currentRef.current].fadeOut(0.3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, names])

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = -0.5 + pointer.x * 0.3
    }
  })

  return (
    <group ref={group} position={[x, y, 0]} scale={scale} rotation={[0, -0.5, 0]}>
      <primitive object={scene} />
    </group>
  )
}
useGLTF.preload('/models/robot.glb')

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
