import { useEffect, useRef, useState } from 'react'

// A little bot that rides down the right edge of the screen, tracking how far
// down the page you are. Stays out of the way until you actually start
// scrolling, then eases in and follows along with a bit of lag so it feels
// like it's tagging along rather than snapping to a scrollbar.
export default function ScrollCompanion() {
  const dotRef = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const computeTarget = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      targetRef.current = pct
      if (!visible && doc.scrollTop > 60) setVisible(true)
    }

    const onScroll = () => computeTarget()
    computeTarget()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const tick = () => {
      const el = dotRef.current
      if (el) {
        const lerpAmt = reduceMotion ? 1 : 0.08
        currentRef.current += (targetRef.current - currentRef.current) * lerpAmt
        const track = window.innerHeight - 128 // top/bottom margin for the ride lane
        const top = 84 + currentRef.current * track
        el.style.transform = `translateY(${top}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = window.setInterval(() => {
      setBlink(true)
      window.setTimeout(() => setBlink(false), 140)
    }, 3600)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      ref={dotRef}
      className="scroll-companion"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <svg viewBox="0 0 60 60" width="44" height="44">
        <circle cx="30" cy="30" r="27" fill="var(--pcb-1)" stroke="var(--line-bright)" strokeWidth="1.4" />
        <circle cx="30" cy="10" r="2.6" fill="var(--copper)" className="companion-antenna" />
        <line x1="30" y1="13" x2="30" y2="18" stroke="var(--copper)" strokeWidth="1.4" />
        <rect x="15" y="18" width="30" height="24" rx="7" fill="none" stroke="var(--gold)" strokeWidth="1.6" />
        <g className={blink ? 'companion-eyes blink' : 'companion-eyes'}>
          <rect x="21" y="27" width="6" height={blink ? 1 : 6} rx="2" fill="var(--gold)" />
          <rect x="33" y="27" width="6" height={blink ? 1 : 6} rx="2" fill="var(--gold)" />
        </g>
      </svg>

      <style>{`
        .scroll-companion{
          position: fixed;
          right: max(14px, env(safe-area-inset-right, 0px) + 10px);
          top: 0;
          left: auto;
          z-index: 45;
          pointer-events: none;
          transition: opacity .4s ease;
          will-change: transform;
        }
        @media (max-width: 640px){ .scroll-companion{ display: none; } }
        .companion-antenna{ animation: companion-bob 2.4s ease-in-out infinite; transform-origin: 30px 10px; }
        @keyframes companion-bob{ 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-1.5px); } }
        @media (prefers-reduced-motion: reduce){ .companion-antenna{ animation: none; } }
      `}</style>
    </div>
  )
}
