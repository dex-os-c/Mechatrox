import { useState } from 'react'
import { eventInfo } from '../data/events'

export default function CollegeBar() {
  const [logoOk, setLogoOk] = useState(true)

  return (
    <div className="wrap flex items-center justify-between gap-x-6 gap-y-1 py-4 flex-wrap" style={{ background: 'var(--pcb-1)', borderBottom: '1px solid var(--line-bright)' }}>
      <div className="flex items-center gap-3 min-w-0">
        {logoOk ? (
          <img
            src="/pmc-crest.png"
            alt="PMC Tech crest"
            className="h-14 md:h-20 w-auto object-contain flex-shrink-0"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
            onError={() => setLogoOk(false)}
          />
        ) : (
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 36, height: 36, border: '1px solid var(--line-bright)', background: 'var(--pcb-0)' }}
          >
            <span className="font-mono font-bold leading-none" style={{ fontSize: 10, color: 'var(--gold)' }}>PMC</span>
          </span>
        )}
        <span className="hidden sm:block w-px self-stretch flex-shrink-0" style={{ background: 'var(--line-bright)' }} />
        <div className="leading-tight min-w-0">
          <span className="font-mono text-[12px] md:text-[14px] font-bold tracking-[0.14em] block" style={{ color: 'var(--gold)' }}>
            &nbsp;
          </span>
          <span className="block text-[13px] md:text-[15px] leading-snug" style={{ color: 'var(--ink-dim)' }}>
            {eventInfo.college}{eventInfo.autonomous ? ' (Autonomous)' : ''}
          </span>
          <span className="block font-mono text-[10px] md:text-[11px] leading-snug mt-0.5" style={{ color: 'var(--ink-faint)' }}>
            {eventInfo.address}
          </span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-1.5 font-mono text-[9.5px] flex-shrink-0" style={{ color: 'var(--ink-faint)' }}>
        <span>{eventInfo.website}</span>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        {eventInfo.accreditations.map((a) => (
          <span
            key={a}
            className="font-mono text-[9px] font-bold tracking-[0.08em] px-2.5 py-1"
            style={{ border: '1px solid var(--copper)', color: 'var(--copper-bright)', background: 'rgba(201,122,74,0.08)' }}
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  )
}
