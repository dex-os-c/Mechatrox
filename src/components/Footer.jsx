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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1.1fr] gap-10 py-10 md:py-14">
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
            <a href={`mailto:${eventInfo.email}`} className="block text-sm mb-2.5" style={{ color: 'var(--ink-dim)' }}>{eventInfo.email}</a>
            <a
              href={`https://instagram.com/${eventInfo.instagram}`}
              target="_blank" rel="noopener"
              className="text-sm"
              style={{ color: 'var(--ink-dim)' }}
            >
              @{eventInfo.instagram}
            </a>
          </div>
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.1em] mb-4" style={{ color: 'var(--ink-faint)' }}>COORDINATORS</h4>
            <p className="text-sm leading-snug mb-0.5" style={{ color: 'var(--ink)' }}>{eventInfo.hod.name}</p>
            <p className="text-xs mb-3" style={{ color: 'var(--ink-faint)' }}>{eventInfo.hod.title}</p>

            <p className="font-mono text-[10px] tracking-[0.08em] mb-1.5" style={{ color: 'var(--ink-faint)' }}>FACULTY</p>
            {eventInfo.facultyCoordinators.map((f) => (
              <p key={f.name} className="text-sm mb-1" style={{ color: 'var(--ink-dim)' }}>{f.name}</p>
            ))}

            <p className="font-mono text-[10px] tracking-[0.08em] mt-3 mb-1.5" style={{ color: 'var(--ink-faint)' }}>STUDENT</p>
            {eventInfo.studentCoordinators.map((s) => (
              <a
                key={s.name}
                href={`tel:+91${s.phone.replace(/\s/g, '')}`}
                className="flex items-center justify-between gap-3 text-sm mb-1"
                style={{ color: 'var(--ink-dim)' }}
              >
                <span>{s.name}</span>
                <span className="font-mono text-xs" style={{ color: 'var(--copper-bright)' }}>{s.phone}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center py-7 flex-wrap gap-4 font-mono text-[11.5px]" style={{ borderTop: '1px solid var(--line)', color: 'var(--ink-faint)' }}>
          <span>© 2026 {eventInfo.department}, {eventInfo.collegeShort}</span>
          <button className="font-mono text-[11.5px] bg-transparent border-none cursor-pointer" style={{ color: 'var(--ink-faint)' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            BACK TO TOP ↑
          </button>
        </div>

        <div className="pb-8 font-mono text-[11px] text-center" style={{ color: 'var(--ink-faint)' }}>
          <span>Website built by students of {eventInfo.department}, {eventInfo.collegeShort} — </span>
          {eventInfo.developers.map((name, i) => (
            <span key={name} className="font-semibold" style={{ color: 'var(--copper-bright)' }}>
              {name}{i < eventInfo.developers.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
