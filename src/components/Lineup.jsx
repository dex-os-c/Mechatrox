import { Suspense, lazy, useState } from 'react'
import { technicalEvents, nonTechnicalEvents } from '../data/events'

const LineupCanvas = lazy(() => import('./LineupCanvas'))

const ALL = [
  ...technicalEvents.map((e) => ({ ...e, track: 'Technical' })),
  ...nonTechnicalEvents.map((e) => ({ ...e, track: 'Non-Technical' })),
]

export default function Lineup() {
  const [active, setActive] = useState(ALL[0])

  return (
    <section id="lineup" className="py-16 md:py-28">
      <div className="wrap grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <div className="reveal">
          <div className="sec-label">THE LINEUP</div>
          <h2 style={{ fontSize: 'clamp(32px,4.4vw,52px)' }}>Ten events. Two tracks.</h2>
          <ul className="list-none mt-6 p-0">
            {ALL.map((ev, i) => (
              <li
                key={ev.code}
                className={`lineup-item ${active.key === ev.key ? 'active' : ''}`}
                onMouseEnter={() => setActive(ev)}
                onClick={() => setActive(ev)}
              >
                <span className="li-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="li-title">{ev.title}</span>
                <span className="li-tag">{ev.track}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative reveal" style={{ aspectRatio: '1/1', border: '1px solid var(--line-bright)', background: 'var(--pcb-1)' }}>
          <Suspense fallback={null}>
            <LineupCanvas activeKey={active.key} />
          </Suspense>
          <div
            className="absolute left-0 right-0 bottom-0 px-5 py-4 font-mono text-xs"
            style={{ color: 'var(--ink-dim)', borderTop: '1px solid var(--line)', background: 'rgba(4,16,13,0.65)' }}
          >
            {active.desc}
          </div>
        </div>
      </div>
    </section>
  )
}
