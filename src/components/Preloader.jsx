import { useEffect, useState } from 'react'
import { eventInfo } from '../data/events'

// Reveal thresholds are tuned against the ~0-100 climb below, not real
// timings -- this is a fake boot sequence, the "systems" being
// initialised don't exist. Text is themed to match the PCB/mechatronics
// identity used everywhere else on the site.
const BOOT_LOG = [
  { at: 4, text: 'initializing core systems' },
  { at: 18, text: 'mounting mechatronics modules' },
  { at: 34, text: 'calibrating servo array' },
  { at: 50, text: 'establishing PCB uplink' },
  { at: 66, text: 'compiling event manifest' },
  { at: 80, text: 'syncing registration node' },
  { at: 92, text: 'rendering interface' },
]

export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [lineCount, setLineCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 16 + 3
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          onDone?.()
        }, 420)
      }
      const floored = Math.floor(p)
      setPct(floored)
      setLineCount(BOOT_LOG.filter((l) => floored >= l.at).length)
    }, 150)

    // absolute fallback: never leave the user staring at a frozen loader
    const fallback = setTimeout(() => {
      setDone(true)
      onDone?.()
    }, 4200)

    return () => {
      clearInterval(interval)
      clearTimeout(fallback)
    }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-700"
      style={{
        background: 'var(--pcb-0)',
        opacity: done ? 0 : 1,
        visibility: done ? 'hidden' : 'visible',
        pointerEvents: done ? 'none' : 'auto',
      }}
    >
      <div className="boot-scanlines" />
      <div className="boot-sweep" />
      <div className="boot-vignette" />

      <div className="boot-frame relative z-10 text-center px-6" style={{ width: 'min(92vw, 380px)' }}>
        <span className="boot-corner tl" />
        <span className="boot-corner tr" />
        <span className="boot-corner bl" />
        <span className="boot-corner br" />

        <div
          className="inline-flex items-center gap-2 mb-7 font-mono text-[10.5px] tracking-[0.32em]"
          style={{ color: 'var(--copper-bright)' }}
        >
          <span className="boot-dot" /> SYSTEM BOOT
        </div>

        <svg className="boot-mark mx-auto mb-6 block" width="50" height="50" viewBox="0 0 52 52" fill="none">
          <polygon points="26,3 46,15 46,37 26,49 6,37 6,15" stroke="var(--gold)" strokeWidth="1.3" opacity="0.9" />
          <polygon points="26,13 38,20 38,32 26,39 14,32 14,20" stroke="var(--copper-bright)" strokeWidth="1" opacity="0.7" />
          <line x1="26" y1="3" x2="26" y2="13" stroke="var(--gold)" strokeWidth="1" />
          <line x1="46" y1="15" x2="38" y2="20" stroke="var(--gold)" strokeWidth="1" />
          <line x1="46" y1="37" x2="38" y2="32" stroke="var(--gold)" strokeWidth="1" />
          <line x1="26" y1="49" x2="26" y2="39" stroke="var(--gold)" strokeWidth="1" />
          <line x1="6" y1="37" x2="14" y2="32" stroke="var(--gold)" strokeWidth="1" />
          <line x1="6" y1="15" x2="14" y2="20" stroke="var(--gold)" strokeWidth="1" />
          <circle className="boot-mark-core" cx="26" cy="26" r="3.2" fill="var(--gold)" />
        </svg>

        <h1
          className="boot-title font-mono"
          data-text={eventInfo.festName}
          style={{ fontSize: 'clamp(24px,7vw,38px)', letterSpacing: '0.02em' }}
        >
          {eventInfo.festName}
        </h1>
        <p className="font-mono text-[10.5px] tracking-[0.26em] mt-2 mb-8" style={{ color: 'var(--ink-faint)' }}>
          {eventInfo.tagline}
        </p>

        <div className="boot-log text-left mx-auto mb-8">
          {BOOT_LOG.map((l, i) => (
            <div key={l.text} className={`boot-line font-mono ${i < lineCount ? 'visible' : ''}`}>
              <span className="boot-caret">&gt;</span> {l.text}
              {i === lineCount - 1 && pct < 100 && <span className="boot-cursor">_</span>}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="boot-bar-track relative">
            <div className="boot-bar-fill" style={{ width: `${pct}%` }} />
            <div className="boot-bar-shine" style={{ left: `${pct}%` }} />
          </div>
          <div
            className="font-mono text-[13px]"
            style={{ color: 'var(--gold)', textShadow: '0 0 10px rgba(217,164,65,0.6)', minWidth: 38 }}
          >
            {String(pct).padStart(2, '0')}%
          </div>
        </div>

        <div
          className="font-mono text-[10px] tracking-[0.22em] mt-6"
          style={{ color: pct >= 100 ? 'var(--gold)' : 'var(--ink-faint)' }}
        >
          {pct >= 100 ? 'ONLINE — WELCOME' : 'PLEASE WAIT'}
        </div>
      </div>
    </div>
  )
}
