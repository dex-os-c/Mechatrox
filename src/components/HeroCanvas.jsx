import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { RobotModel, NetworkField } from '../three/Hero3D'

// Split out from Hero.jsx so three.js + @react-three/fiber only load in
// this chunk, dynamically imported by Hero via React.lazy.
export default function HeroCanvas() {
  return (
    <Canvas camera={{ position: [1.2, 1.3, 5.2], fov: 42 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={0.9} />
      <pointLight position={[-2, 1.5, 2]} color="#D9A441" intensity={1.6} />
      <pointLight position={[2, -1, -2]} color="#C97A4A" intensity={1} />
      <Suspense fallback={null}>
        <NetworkField />
        <RobotModel />
      </Suspense>
    </Canvas>
  )
}
