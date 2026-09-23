import { useEffect, useState } from 'react'
import { eventInfo } from '../data/events'

const LINKS = [
  { href: '#lineup', label: 'Lineup' },
  { href: '#events-technical', label: 'Technical' },
  { href: '#events-nontechnical', label: 'Non-Technical' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{
          background: scrolled || open ? 'rgba(4,16,13,0.9)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(10px)' : 'none',
          borderBottom: `1px solid ${scrolled || open ? 'var(--line)' : 'transparent'}`,
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <nav className="wrap flex items-center justify-between h-[62px] md:h-[78px]">
          <a href="#" className="flex items-center gap-2.5 relative z-10" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 30 30" fill="none" className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0">
              <rect x="9" y="9" width="12" height="12" stroke="#D9A441" strokeWidth="1.2" />
              <line x1="15" y1="1" x2="15" y2="9" stroke="#C97A4A" strokeWidth="1.2" />
              <line x1="15" y1="21" x2="15" y2="29" stroke="#C97A4A" strokeWidth="1.2" />
              <line x1="1" y1="15" x2="9" y2="15" stroke="#C97A4A" strokeWidth="1.2" />
              <line x1="21" y1="15" x2="29" y2="15" stroke="#C97A4A" strokeWidth="1.2" />
              <circle cx="15" cy="15" r="2.4" fill="#D9A441" />
            </svg>
            <span className="leading-tight">
              <span className="font-mono text-[13px] md:text-[15px] font-bold tracking-[0.08em] block" style={{ color: 'var(--ink)' }}>
                {eventInfo.festName}
              </span>
              <span className="hidden md:block font-mono text-[9px] tracking-[0.1em]" style={{ color: 'var(--ink-faint)' }}>
                {eventInfo.department.toUpperCase()}
              </span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm relative group" style={{ color: 'var(--ink-dim)' }}>
                {l.label}
                <span className="absolute left-0 -bottom-0.5 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'var(--gold)' }} />
              </a>
            ))}
          </div>

          <a href="#contact" className="btn filled hidden md:inline-flex">Register your team</a>

          <button
            className="md:hidden w-9 h-9 relative z-10 flex-shrink-0"
            style={{ border: '1px solid var(--line-bright)', background: open ? 'var(--pcb-1)' : 'transparent' }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="absolute left-[9px] right-[9px] h-px transition-transform duration-300" style={{ background: 'var(--ink)', top: open ? '17px' : '13px', transform: open ? 'rotate(45deg)' : 'none' }} />
            <span className="absolute left-[9px] right-[9px] h-px top-[17px] transition-opacity duration-200" style={{ background: 'var(--ink)', opacity: open ? 0 : 1 }} />
            <span className="absolute left-[9px] right-[9px] h-px transition-transform duration-300" style={{ background: 'var(--ink)', top: open ? '17px' : '21px', transform: open ? 'rotate(-45deg)' : 'none' }} />
          </button>
        </nav>
      </header>

      <div
        className="fixed inset-0 z-40 flex flex-col justify-center px-8 transition-all duration-400 md:hidden"
        style={{
          background: 'var(--pcb-0)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-16px)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-baseline gap-4 py-4 group"
              style={{
                borderBottom: '1px solid var(--line)',
                transition: `opacity .35s ease ${open ? i * 0.06 + 0.1 : 0}s, transform .35s ease ${open ? i * 0.06 + 0.1 : 0}s`,
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0)' : 'translateX(-12px)',
              }}
              onClick={() => setOpen(false)}
            >
              <span className="font-mono text-xs" style={{ color: 'var(--ink-faint)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="text-3xl font-semibold group-active:opacity-60" style={{ color: 'var(--ink)' }}>{l.label}</span>
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="btn filled self-start mt-8"
          style={{
            transition: `opacity .35s ease ${open ? LINKS.length * 0.06 + 0.14 : 0}s, transform .35s ease ${open ? LINKS.length * 0.06 + 0.14 : 0}s`,
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(8px)',
          }}
          onClick={() => setOpen(false)}
        >
          Register your team
        </a>
      </div>
    </>
  )
}
