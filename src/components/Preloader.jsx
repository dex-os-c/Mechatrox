import { useEffect, useRef, useState } from 'react'

const BOOT_LINES = [
  'INIT MECHATROX-OS v2.6',
  'CALIBRATING SERVO ARRAY...',
  'LINKING SENSOR NETWORK...',
  'LOADING EVENT MODULES [10/10]',
  'SYSTEMS NOMINAL',
]

export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const [done, setDone] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          onDoneRef.current?.()
        }, 250)
      }
      setPct(Math.floor(p))
      setLineIdx(Math.min(BOOT_LINES.length - 1, Math.floor((p / 100) * BOOT_LINES.length)))
    }, 130)

    // absolute fallback: never leave the user staring at a frozen loader
    const fallback = setTimeout(() => {
      setDone(true)
      onDoneRef.current?.()
    }, 4000)

    return () => {
      clearInterval(interval)
      clearTimeout(fallback)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500"
      style={{
        background: 'var(--pcb-0)',
        opacity: done ? 0 : 1,
        visibility: done ? 'hidden' : 'visible',
        pointerEvents: done ? 'none' : 'auto',
      }}
    >
      <div className="text-center" style={{ width: 280 }}>
        <div
          className="font-mono text-[13px] tracking-[0.3em] mb-4"
          style={{ color: 'var(--gold)', textShadow: '0 0 8px rgba(255,30,30,0.6)' }}
        >
          BOOTING MECHATROX
        </div>

        <div className="font-mono text-[10.5px] mb-5" style={{ color: 'var(--ink-faint)', minHeight: 16 }}>
          <span key={lineIdx} style={{ animation: 'boot-flicker .35s ease' }}>
            &gt; {BOOT_LINES[lineIdx]}
          </span>
        </div>

        <div className="w-56 h-[2px] mx-auto" style={{ background: 'var(--line-bright)' }}>
          <div
            className="h-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--copper), var(--gold))',
              boxShadow: '0 0 6px rgba(255,30,30,0.7)',
              transition: 'width .1s linear',
            }}
          />
        </div>
        <div className="font-mono text-xs mt-3" style={{ color: 'var(--copper-bright)' }}>
          {String(pct).padStart(2, '0')}%
        </div>
      </div>

      <style>{`
        @keyframes boot-flicker {
          0% { opacity: 0; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
