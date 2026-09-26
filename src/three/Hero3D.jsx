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

// --- Shooting stars ---------------------------------------------------
//
// A pool of streaks, each rendered as a single stretched quad (not a
// particle system) with a horizontal gradient texture: transparent at
// the trailing edge, bright at the leading edge. Additive blending on
// top of the dark PCB background gives a glowing-comet look for free,
// with no extra geometry per star.
//
// Every star in the pool runs its own independent spawn -> fly ->
// fade -> cooldown -> respawn loop with fully randomised position,
// angle, speed, length and colour, so it never reads as a fixed,
// repeating pattern the way a single looping animation would.
const STAR_COUNT = 12
const STAR_COLORS = ['#D9A441', '#F5E9D3', '#C97A4A', '#FFFFFF']

function useStreakTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 16
    const ctx = canvas.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, 128, 0)
    grad.addColorStop(0, 'rgba(255,255,255,0)')
    grad.addColorStop(0.55, 'rgba(255,255,255,0.35)')
    grad.addColorStop(1, 'rgba(255,255,255,1)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 128, 16)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])
}

function makeStarState(initialDelay) {
  return {
    active: false,
    delay: initialDelay,
    pos: new THREE.Vector3(),
    dir: new THREE.Vector3(1, 0, 0),
    speed: 0,
    length: 1,
    life: 0,
    duration: 1,
  }
}

export function ShootingStars() {
  const texture = useStreakTexture()

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1)
    geo.translate(0.5, 0, 0) // local x: 0 = tail (transparent), 1 = head (bright)
    return geo
  }, [])

  const materials = useMemo(
    () => Array.from({ length: STAR_COUNT }, () => new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })),
    [texture]
  )

  const starsRef = useRef()
  if (!starsRef.current) {
    // Staggered initial delays so the whole pool doesn't fire in one
    // burst on load -- they arrive spread out, like they've already
    // been going for a while.
    starsRef.current = Array.from({ length: STAR_COUNT }, (_, i) => makeStarState((i / STAR_COUNT) * 3 + Math.random() * 2))
  }
  const meshRefs = useRef([])

  const spawn = (s, material) => {
    const flip = Math.random() < 0.5 ? -1 : 1
    const angle = -(0.28 + Math.random() * 0.4) // ~16-38deg below horizontal
    s.dir.set(Math.cos(angle) * flip, Math.sin(angle), 0).normalize()
    s.pos.set(
      -flip * (5 + Math.random() * 4.5),
      3 + Math.random() * 2.4,
      -4.5 + Math.random() * 7
    )
    s.duration = 0.5 + Math.random() * 0.55
    const travel = 9 + Math.random() * 8
    s.speed = travel / s.duration
    s.length = 1 + Math.random() * 2.1
    s.life = 0
    s.active = true
    material.color.set(STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)])
  }

  useFrame((state, delta) => {
    starsRef.current.forEach((s, i) => {
      const mesh = meshRefs.current[i]
      const material = materials[i]
      if (!mesh) return

      if (!s.active) {
        s.delay -= delta
        if (s.delay <= 0) spawn(s, material)
        return
      }

      s.life += delta
      s.pos.addScaledVector(s.dir, s.speed * delta)

      const t = s.life / s.duration
      let alpha
      if (t < 0.12) alpha = t / 0.12
      else if (t > 0.7) alpha = Math.max(0, (1 - t) / 0.3)
      else alpha = 1
      material.opacity = alpha

      // mesh.position is the *tail* (local x=0), so offset back from the
      // current head position by the streak's own length.
      mesh.position.copy(s.pos).addScaledVector(s.dir, -s.length)
      mesh.rotation.z = Math.atan2(s.dir.y, s.dir.x)
      mesh.scale.set(s.length, 0.04 + s.length * 0.018, 1)

      if (t >= 1) {
        s.active = false
        s.delay = 1 + Math.random() * 3.2
        material.opacity = 0
      }
    })
  })

  return (
    <group>
      {starsRef.current.map((_, i) => (
        <mesh
          key={i}
          ref={(m) => { meshRefs.current[i] = m }}
          geometry={geometry}
          material={materials[i]}
        />
      ))}
    </group>
  )
}
