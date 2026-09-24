import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { technicalEvents, nonTechnicalEvents } from '../data/events'
import { ICONS } from '../three/EventIcons'

function RotatingGroup({ children }) {
  const ref = useRef()
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += (reduceMotion ? 0.06 : 0.28) * delta
  })
  return <group ref={ref}>{children}</group>
}

const ALL = [
  ...technicalEvents.map((e) => ({ ...e, track: 'Technical' })),
  ...nonTechnicalEvents.map((e) => ({ ...e, track: 'Non-Technical' })),
]

export default function Lineup({ onSelect }) {
  const [active, setActive] = useState(ALL[0])
  const ActiveIcon = ICONS[active.key]

  return (
    <section id="lineup" className="relative z-10 py-16 md:py-28">
      <div className="wrap grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <div className="reveal">
          <div className="sec-label">THE LINEUP</div>
          <h2 style={{ fontSize: 'clamp(32px,4.4vw,52px)' }}>Eight events. Two tracks.</h2>
          <ul className="list-none mt-6 p-0">
            {ALL.map((ev, i) => (
              <li
                key={ev.code}
                className={`lineup-item ${active.key === ev.key ? 'active' : ''}`}
                onMouseEnter={() => setActive(ev)}
                onFocus={() => setActive(ev)}
                onClick={() => { setActive(ev); onSelect?.(ev) }}
              >
                <span className="li-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="li-title">{ev.title}</span>
                <span className="li-tag">{ev.track}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative reveal" style={{ aspectRatio: '1/1', border: '1px solid var(--line-bright)', background: 'var(--pcb-1)' }}>
          <Canvas camera={{ position: [1.7, 1.3, 2.6], fov: 40 }} dpr={[1, 1.6]}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 3, 2]} intensity={0.9} />
            <Suspense fallback={null}>
              <RotatingGroup>
                <ActiveIcon />
              </RotatingGroup>
            </Suspense>
          </Canvas>
          <button
            type="button"
            className="absolute left-0 right-0 bottom-0 px-5 py-4 font-mono text-xs text-left w-full"
            style={{ color: 'var(--ink-dim)', borderTop: '1px solid var(--line)', background: 'rgba(4,16,13,0.65)', cursor: 'pointer' }}
            onClick={() => onSelect?.(active)}
          >
            {active.desc}
            <span className="block mt-2" style={{ color: 'var(--gold)' }}>VIEW FULL DETAILS →</span>
          </button>
        </div>
      </div>
    </section>
  )
}
