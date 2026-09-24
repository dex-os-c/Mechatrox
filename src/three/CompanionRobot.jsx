import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'

// Real clip names in robot.glb (verified against the file, not guessed):
// Dance, Death, Idle, Jump, No, Punch, Running, Sitting, Standing,
// ThumbsUp, Walking, WalkJump, Wave, Yes.
// Jump reads as a cute little hop for scrolling down; WalkJump (a
// bounding, reaching motion) stands in for a "climb" going back up since
// there's no literal climb clip in this asset.
const MODE_CLIPS = { down: 'Jump', up: 'WalkJump', idle: 'Idle' }
const POKE_CLIPS = ['Wave', 'ThumbsUp', 'Dance', 'Yes']
const DESIRED_HEIGHT = 1.55

export default function CompanionRobot({ mode, poke }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/robot.glb')
  // Hero.jsx uses the raw `scene` from the same cached GLTF with its own
  // mixer — clone here so this second, independent AnimationMixer isn't
  // fighting Hero's mixer over the same skinned mesh attributes.
  const clonedScene = useMemo(() => cloneSkeleton(scene), [scene])
  const { actions, names } = useAnimations(animations, group)
  const currentRef = useRef(null)
  const pokedRef = useRef(false)
  const lastPokeRef = useRef(0)

  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene)
    const height = box.getSize(new THREE.Vector3()).y || 1
    return DESIRED_HEIGHT / height
  }, [clonedScene])

  const playClip = (clip, { once = false } = {}) => {
    const next = actions[clip]
    if (!next || clip === currentRef.current) return
    const prev = currentRef.current
    if (prev && actions[prev]) actions[prev].fadeOut(0.3)
    next.reset()
    if (once) next.setLoop(THREE.LoopOnce, 1).clampWhenFinished = true
    next.fadeIn(0.3).play()
    currentRef.current = clip
  }

  // Tapping the bot plays a one-off fun clip, then falls back to whatever
  // the current scroll mode wants once it finishes — a tap mid-scroll
  // doesn't get stuck stranded on a pose.
  useEffect(() => {
    if (!poke || poke === lastPokeRef.current || !names.length) return
    lastPokeRef.current = poke
    const available = POKE_CLIPS.filter((c) => names.includes(c))
    if (!available.length) return
    const pick = available[Math.floor(Math.random() * available.length)]
    pokedRef.current = true
    playClip(pick, { once: true })
    const next = actions[pick]
    const mixer = next?.getMixer()
    const onFinished = (e) => {
      if (e.action !== next) return
      mixer.removeEventListener('finished', onFinished)
      pokedRef.current = false
      playClip(MODE_CLIPS[mode] || 'Idle')
    }
    mixer?.addEventListener('finished', onFinished)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poke])

  useEffect(() => {
    if (!names.length || pokedRef.current) return
    const wanted = MODE_CLIPS[mode] || 'Idle'
    const clip = names.includes(wanted) ? wanted : names[0]
    playClip(clip)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, actions, names])

  useFrame((state) => {
    if (group.current) {
      // Small continuous sway so it never looks frozen between clips,
      // plus a lean into the direction of travel for a bit of character.
      const lean = mode === 'down' ? -0.12 : mode === 'up' ? 0.12 : 0
      group.current.rotation.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      group.current.rotation.z = lean * 0.5
    }
  })

  return (
    <group ref={group} position={[0, -DESIRED_HEIGHT / 2 + 0.12, 0]} scale={scale} rotation={[0, -0.3, 0]}>
      <primitive object={clonedScene} />
    </group>
  )
}
useGLTF.preload('/models/robot.glb')
