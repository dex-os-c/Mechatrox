import { useEffect, useState } from 'react'
import { eventInfo } from '../data/events'
import CollegeBar from './CollegeBar'

const LINKS = [
  { href: '#lineup', label: 'Lineup' },
  { href: '#events-technical', label: 'Technical' },
  { href: '#events-nontechnical', label: 'Non-Technical' },
  { href: '#contact', label: 'Contact' },
]

const SECTION_IDS = ['lineup', 'events-technical', 'events-nontechnical', 'contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lightweight scrollspy so the current section is visibly highlighted
  // rather than the nav just sitting there as a static list of links.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled || open ? 'rgba(4,16,13,0.88)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(14px)' : 'none',
          borderBottom: `1px solid ${scrolled || open ? 'var(--line-bright)' : 'transparent'}`,
          boxShadow: scrolled ? '0 10px 30px -18px rgba(0,0,0,0.6)' : 'none',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <CollegeBar />
        <nav className="wrap flex items-center justify-between h-[60px] md:h-[74px]">
          <a href="#" className="nav-brand flex items-center gap-2.5 relative z-10" onClick={() => setOpen(false)}>
            <span className="nav-brand-mark">
              <svg viewBox="0 0 30 30" fill="none" className="w-[18px] h-[18px] md:w-5 md:h-5 flex-shrink-0">
                <rect x="9" y="9" width="12" height="12" stroke="#D9A441" strokeWidth="1.2" />
                <line x1="15" y1="1" x2="15" y2="9" stroke="#C97A4A" strokeWidth="1.2" />
                <line x1="15" y1="21" x2="15" y2="29" stroke="#C97A4A" strokeWidth="1.2" />
                <line x1="1" y1="15" x2="9" y2="15" stroke="#C97A4A" strokeWidth="1.2" />
                <line x1="21" y1="15" x2="29" y2="15" stroke="#C97A4A" strokeWidth="1.2" />
                <circle cx="15" cy="15" r="2.4" fill="#D9A441" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="font-mono text-[12.5px] md:text-[14.5px] font-bold tracking-[0.08em] block" style={{ color: 'var(--ink)' }}>
                {eventInfo.festName}
              </span>
              <span className="hidden md:block font-mono text-[8.5px] tracking-[0.14em]" style={{ color: 'var(--ink-faint)' }}>
                {eventInfo.department.toUpperCase()}
              </span>
            </span>
          </a>

          <div className="nav-pill hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link ${activeHref === l.href ? 'active' : ''}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="font-mono text-[10.5px] tracking-[0.1em]" style={{ color: 'var(--ink-faint)' }}>
              {eventInfo.date}
            </span>
          </div>

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
        <div className="mobile-menu-grid" aria-hidden="true" />
        <div className="flex flex-col relative z-10">
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
              <span className="font-mono text-xs" style={{ color: activeHref === l.href ? 'var(--gold)' : 'var(--ink-faint)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="text-3xl font-semibold group-active:opacity-60" style={{ color: activeHref === l.href ? 'var(--gold)' : 'var(--ink)' }}>{l.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
