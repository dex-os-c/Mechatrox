import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'

const COPPER = '#C81E1E'
const GOLD = '#FF1E1E'
const DARK = '#0F281F'
const DEEP = '#081A15'
const DANGER = '#FF2A2A'

/** TE.01 — Theorix: stacked, offset presentation slides that riffle gently */
export function PptIcon() {
  const group = useRef()
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9) * 0.05
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.04
    }
  })
  return (
    <group ref={group} rotation={[-0.3, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-i * 0.14, i * 0.18, i * 0.12]}>
          <boxGeometry args={[1.3, 0.05, 0.9]} />
          <meshStandardMaterial color={DEEP} roughness={0.7} />
          <Edges color={i === 2 ? GOLD : COPPER} />
        </mesh>
      ))}
      <mesh position={[-0.28, 0.42, -0.24]}>
        <boxGeometry args={[1.0, 0.06, 0.16]} />
        <meshStandardMaterial color={GOLD} />
      </mesh>
    </group>
  )
}

/** TE.02 — Tech Quiz: torus-knot with orbiting data points */
export function QuizIcon() {
  const orbiters = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    orbiters.current.forEach((m, i) => {
      if (!m) return
      const a = t * (0.8 + i * 0.3) + i * 2
      m.position.set(Math.cos(a) * 1.05, Math.sin(a * 1.3) * 0.35, Math.sin(a) * 1.05)
    })
  })
  return (
    <group>
      <mesh>
        <torusKnotGeometry args={[0.42, 0.12, 90, 10]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (orbiters.current[i] = el)}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={COPPER} />
        </mesh>
      ))}
    </group>
  )
}

/** TE.03 — Project Expo: a raised showcase plinth with a floating award gem */
export function ExpoIcon() {
  const gem = useRef()
  useFrame((state, delta) => {
    if (gem.current) {
      gem.current.rotation.y += delta * 0.6
      gem.current.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05
    }
  })
  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.28, 24]} />
        <meshStandardMaterial color={DEEP} metalness={0.3} roughness={0.6} />
        <Edges color={COPPER} />
      </mesh>
      <mesh ref={gem} position={[0, 0.55, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  )
}

/** TE.04 — Mirror Verse: a shape and its mirrored twin either side of a symmetry line */
export function MirrorIcon() {
  const group = useRef()
  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.35
  })
  return (
    <group ref={group}>
      <mesh position={[-0.55, 0, 0]}>
        <coneGeometry args={[0.35, 0.7, 4]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.55, 0, 0]} scale={[-1, 1, 1]}>
        <coneGeometry args={[0.35, 0.7, 4]} />
        <meshStandardMaterial color={COPPER} metalness={0.5} roughness={0.3} transparent opacity={0.85} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.015, 1.1, 0.015]} />
        <meshBasicMaterial color="#8FA39B" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

/** NT.01 — IPL Auction: gavel */
export function AuctionIcon() {
  const group = useRef()
  useFrame((state) => {
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.03
  })
  return (
    <group ref={group} rotation={[-0.25, 0, 0]}>
      <mesh position={[-0.1, -0.1, 0]} rotation={[0, 0, Math.PI / 2.6]}>
        <cylinderGeometry args={[0.06, 0.06, 1.3, 10]} />
        <meshStandardMaterial color={DEEP} roughness={0.6} />
      </mesh>
      <mesh position={[0.5, 0.33, 0]} rotation={[0, 0, Math.PI / 2.6]}>
        <cylinderGeometry args={[0.26, 0.26, 0.5, 16]} />
        <meshStandardMaterial color={COPPER} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.1, 20]} />
        <meshStandardMaterial color={DEEP} />
      </mesh>
    </group>
  )
}

/** NT.02 — E-Sports: controller */
export function EsportsIcon() {
  return (
    <group rotation={[-0.3, 0, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 0.26, 0.7]} />
        <meshStandardMaterial color={DEEP} roughness={0.6} />
        <Edges color={COPPER} />
      </mesh>
      {[-0.4, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.19, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 10]} />
          <meshStandardMaterial color={GOLD} />
        </mesh>
      ))}
      {[-0.17, 0.17].map((z, i) => (
        <mesh key={i} position={[0.65, 0.15, z]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color={COPPER} />
        </mesh>
      ))}
    </group>
  )
}

/** NT.03 — Meme Marathon: a grinning 3D face */
export function MemeIcon() {
  const group = useRef()
  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.4
  })
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.3} roughness={0.5} />
      </mesh>
      {[-0.22, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0.52]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={DEEP} />
        </mesh>
      ))}
      <mesh position={[0, -0.15, 0.5]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.22, 0.05, 8, 24, Math.PI]} />
        <meshStandardMaterial color={DEEP} />
      </mesh>
    </group>
  )
}

/** NT.04 — Advertisement: megaphone with sound rings */
export function AdIcon() {
  const rings = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    rings.current.forEach((r, i) => {
      if (!r) return
      const phase = (t * 0.6 + i / 3) % 1
      const s = 0.7 + phase * 2.1
      r.scale.set(s, s, s)
      r.position.x = 0.66 + phase * 0.6
      r.material.opacity = 1 - phase
    })
  })
  return (
    <group rotation={[-0.25, 0, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.55, 0.9, 20, 1, true]} />
        <meshStandardMaterial color={COPPER} metalness={0.5} roughness={0.35} side={2} />
      </mesh>
      <mesh position={[-0.6, -0.36, 0]} rotation={[0, 0, Math.PI / 2.4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 10]} />
        <meshStandardMaterial color={DEEP} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.18, 0.014, 8, 24]} />
          <meshBasicMaterial color={GOLD} transparent />
        </mesh>
      ))}
    </group>
  )
}

export const ICONS = {
  ppt: PptIcon,
  quiz: QuizIcon,
  expo: ExpoIcon,
  mirror: MirrorIcon,
  ipl: AuctionIcon,
  esports: EsportsIcon,
  meme: MemeIcon,
  ad: AdIcon,
}
