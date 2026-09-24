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

export function RobotModel() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/Soldier.glb')
  const { actions, names } = useAnimations(animations, group)
  const { pointer } = useThree()
  const currentRef = useRef(null)
  const cycleIndexRef = useRef(0)

  const prepared = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const scale = 2.7 / Math.max(size.x, size.y, size.z)
    return scale
  }, [scene])

  const play = (clipName) => {
    const clip = names.includes(clipName) ? clipName : names[0]
    const next = actions[clip]
    if (!next || clip === currentRef.current) return
    const prev = currentRef.current
    if (prev && actions[prev]) actions[prev].fadeOut(0.5)
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

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = -0.5 + pointer.x * 0.3
    }
  })

  return (
    <group ref={group} position={[1.15, -1.15, 0]} scale={prepared} rotation={[0, -0.5, 0]}>
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
