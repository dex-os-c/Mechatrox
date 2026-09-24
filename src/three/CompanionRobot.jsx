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
const DESIRED_HEIGHT = 1.55

export default function CompanionRobot({ mode }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/robot.glb')
  // Hero.jsx uses the raw `scene` from the same cached GLTF with its own
  // mixer — clone here so this second, independent AnimationMixer isn't
  // fighting Hero's mixer over the same skinned mesh attributes.
  const clonedScene = useMemo(() => cloneSkeleton(scene), [scene])
  const { actions, names } = useAnimations(animations, group)
  const currentRef = useRef(null)

  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene)
    const height = box.getSize(new THREE.Vector3()).y || 1
    return DESIRED_HEIGHT / height
  }, [clonedScene])

  useEffect(() => {
    if (!names.length) return
    const wanted = MODE_CLIPS[mode] || 'Idle'
    const clip = names.includes(wanted) ? wanted : names[0]
    const next = actions[clip]
    if (!next || clip === currentRef.current) return
    const prev = currentRef.current
    if (prev && actions[prev]) actions[prev].fadeOut(0.3)
    next.reset().fadeIn(0.3).play()
    currentRef.current = clip
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
