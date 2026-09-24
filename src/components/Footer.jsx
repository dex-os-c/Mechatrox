import { eventInfo, technicalEvents, nonTechnicalEvents } from '../data/events'

export default function Footer({ onOpenRegister }) {
  return (
    <footer id="contact" className="relative z-10 pt-16 md:pt-24" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="flex justify-between items-end gap-6 flex-wrap pb-10 md:pb-16" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 className="max-w-2xl leading-tight" style={{ fontSize: 'clamp(30px,5vw,56px)' }}>
            Got a team? Bring them to {eventInfo.festName}.
          </h2>
          <button type="button" className="btn filled" onClick={onOpenRegister}>Register your team</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 py-10 md:py-14">
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.1em] mb-4" style={{ color: 'var(--ink-faint)' }}>DEPARTMENT</h4>
            <p className="max-w-[280px] text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
              {eventInfo.department}, {eventInfo.college} ({eventInfo.collegeShort}).
              {eventInfo.festName} is organised and run entirely by students and faculty of the department.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.1em] mb-4" style={{ color: 'var(--ink-faint)' }}>TECHNICAL</h4>
            {technicalEvents.map((e) => (
              <a key={e.code} href="#events-technical" className="block text-sm mb-2.5" style={{ color: 'var(--ink-dim)' }}>{e.title}</a>
            ))}
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.1em] mb-4" style={{ color: 'var(--ink-faint)' }}>NON-TECHNICAL</h4>
            {nonTechnicalEvents.map((e) => (
              <a key={e.code} href="#events-nontechnical" className="block text-sm mb-2.5" style={{ color: 'var(--ink-dim)' }}>{e.title}</a>
            ))}
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.1em] mb-4" style={{ color: 'var(--ink-faint)' }}>VISIT</h4>
            <p className="text-sm mb-2.5" style={{ color: 'var(--ink-dim)' }}>{eventInfo.address}</p>
            <p className="text-sm mb-2.5" style={{ color: 'var(--ink-dim)' }}>{eventInfo.website}</p>
          </div>
        </div>

        <div className="flex justify-between items-center py-7 flex-wrap gap-4 font-mono text-[11.5px]" style={{ borderTop: '1px solid var(--line)', color: 'var(--ink-faint)' }}>
          <span>© 2026 {eventInfo.department}, {eventInfo.collegeShort}</span>
          <button className="font-mono text-[11.5px] bg-transparent border-none cursor-pointer" style={{ color: 'var(--ink-faint)' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            BACK TO TOP ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
