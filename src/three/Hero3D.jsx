import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

const COPPER = '#C97A4A'
const GOLD = '#D9A441'

const FUN_CLIPS = ['Wave', 'ThumbsUp', 'Yes', 'Dance', 'Jump']

export function RobotModel() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/robot.glb')
  const { actions, names } = useAnimations(animations, group)
  const { pointer } = useThree()
  const currentRef = useRef(null)

  const prepared = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const scale = 2.6 / Math.max(size.x, size.y, size.z)
    return scale
  }, [scene])

  const playIdle = () => {
    const idle = names.find((n) => /idle/i.test(n)) || names[0]
    if (idle && actions[idle]) {
      actions[idle].reset().fadeIn(0.4).play()
      currentRef.current = idle
    }
  }

  useEffect(() => {
    playIdle()
    return () => {
      if (currentRef.current && actions[currentRef.current]) actions[currentRef.current].fadeOut(0.3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, names])

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = -0.5 + pointer.x * 0.3
    }
  })

  const playFun = () => {
    const available = FUN_CLIPS.filter((c) => names.includes(c))
    if (!available.length) return
    const pick = available[Math.floor(Math.random() * available.length)]
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

  return (
    <group
      ref={group}
      position={[1.15, -0.9, 0]}
      scale={prepared}
      rotation={[0, -0.5, 0]}
      onClick={(e) => { e.stopPropagation(); playFun() }}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'auto' }}
    >
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
