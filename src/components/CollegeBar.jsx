import { useState } from 'react'
import { eventInfo } from '../data/events'

export default function CollegeBar() {
  const [logoOk, setLogoOk] = useState(true)

  return (
    <div
      className="wrap flex items-center justify-between gap-x-6 gap-y-2 py-2.5 flex-wrap"
      style={{ borderBottom: '1px solid var(--line)' }}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {logoOk ? (
          <img
            src="/pmclogo.png"
            alt="PMC Tech crest"
            className="h-10 w-10 md:h-12 md:w-12 object-contain flex-shrink-0"
            onError={() => setLogoOk(false)}
          />
        ) : (
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 40, height: 40, border: '1px solid var(--line-bright)', background: 'var(--pcb-1)' }}
          >
            <span className="font-mono font-bold leading-none" style={{ fontSize: 11, letterSpacing: '0.02em', color: 'var(--gold)' }}>
              PMC
            </span>
          </span>
        )}
        <div className="leading-tight min-w-0">
          <span className="font-mono text-[11px] md:text-[12px] font-semibold tracking-[0.05em] block" style={{ color: 'var(--ink)' }}>
            {eventInfo.collegeShort.toUpperCase()}
            <span className="font-normal" style={{ color: 'var(--ink-faint)' }}> — {eventInfo.collegeTagline}</span>
          </span>
          <span className="block text-[11.5px] md:text-[12.5px] leading-snug" style={{ color: 'var(--ink-dim)' }}>
            {eventInfo.college}{eventInfo.autonomous ? ' (Autonomous)' : ''}
          </span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-1.5 font-mono text-[9.5px] flex-shrink-0" style={{ color: 'var(--ink-faint)' }}>
        <span>{eventInfo.address}</span>
        <span>·</span>
        <span>{eventInfo.website}</span>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        {eventInfo.accreditations.map((a) => (
          <span
            key={a}
            className="font-mono text-[9px] tracking-[0.05em] px-2 py-[3px]"
            style={{ border: '1px solid var(--copper)', color: 'var(--copper-bright)' }}
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  )
}
