import { useEffect, useState } from 'react'

export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 22
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          onDone?.()
        }, 250)
      }
      setPct(Math.floor(p))
    }, 130)

    // absolute fallback: never leave the user staring at a frozen loader
    const fallback = setTimeout(() => {
      setDone(true)
      onDone?.()
    }, 4000)

    return () => {
      clearInterval(interval)
      clearTimeout(fallback)
    }
  }, [onDone])

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
      <div className="text-center">
        <div className="font-mono text-[13px] tracking-[0.3em] mb-5" style={{ color: 'var(--ink-dim)' }}>
          BOOTING MECHATROX
        </div>
        <div className="w-56 h-[2px] mx-auto" style={{ background: 'var(--line-bright)' }}>
          <div className="h-full" style={{ width: `${pct}%`, background: 'var(--gold)', transition: 'width .1s linear' }} />
        </div>
        <div className="font-mono text-xs mt-3" style={{ color: 'var(--copper-bright)' }}>
          {String(pct).padStart(2, '0')}%
        </div>
      </div>
    </div>
  )
}
