import { useEffect, useRef, useState } from 'react'

// A little bot that pops out of the hero once you start scrolling and rides
// the right edge of the screen after that — hopping side to side on the way
// down, switching to a "climbing" motion on the way back up. Purely
// decorative (aria-hidden), tracks real scroll position but the hop/climb
// motion itself is stylised rather than 1:1 with scroll velocity.
export default function ScrollCompanion() {
  const trackRef = useRef(null)
  const charRef = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef(null)
  const lastScrollTopRef = useRef(0)
  const hopPhaseRef = useRef(0)
  const idleTimerRef = useRef(null)

  const [visible, setVisible] = useState(false)
  const [entered, setEntered] = useState(false)
  const [direction, setDirection] = useState('down') // 'down' -> hopping, 'up' -> climbing
  const [moving, setMoving] = useState(false)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const computeTarget = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      targetRef.current = pct

      const dy = doc.scrollTop - lastScrollTopRef.current
      if (Math.abs(dy) > 1) setDirection(dy > 0 ? 'down' : 'up')
      lastScrollTopRef.current = doc.scrollTop

      if (!visible && doc.scrollTop > 80) setVisible(true)

      setMoving(true)
      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => setMoving(false), 220)
    }

    const onScroll = () => computeTarget()
    computeTarget()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const tick = () => {
      const track = trackRef.current
      const char = charRef.current
      if (track) {
        const lerpAmt = reduceMotion ? 1 : 0.09
        currentRef.current += (targetRef.current - currentRef.current) * lerpAmt
        const lane = window.innerHeight - 150
        const top = 88 + currentRef.current * lane
        track.style.transform = `translateY(${top}px)`
      }
      if (char && !reduceMotion) {
        // Hopping zigzag while actively scrolling — a fast little side-to-side
        // wobble rather than a smooth glide, so it reads as "hopping along".
        hopPhaseRef.current += moving ? 0.22 : 0.05
        const swing = moving ? Math.sin(hopPhaseRef.current) * 9 : Math.sin(hopPhaseRef.current) * 2
        const lift = moving ? Math.abs(Math.cos(hopPhaseRef.current)) * -6 : 0
        char.style.transform = `translate(${swing}px, ${lift}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(idleTimerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, moving])

  // Trigger the "jump out of the hero" entrance once, the moment it first
  // becomes visible.
  useEffect(() => {
    if (!visible) return undefined
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [visible])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = window.setInterval(() => {
      setBlink(true)
      window.setTimeout(() => setBlink(false), 140)
    }, 3600)
    return () => window.clearInterval(id)
  }, [])

  const isClimbing = moving && direction === 'up'
  const isHopping = moving && direction === 'down'

  return (
    <div
      ref={trackRef}
      className={`scroll-companion ${entered ? 'is-entered' : 'is-pre-entrance'}`}
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        ref={charRef}
        className={`scroll-companion-char ${isHopping ? 'hopping' : ''} ${isClimbing ? 'climbing' : ''}`}
      >
        <svg viewBox="0 0 60 74" width="42" height="52">
          {/* legs */}
          <rect className="sc-leg sc-leg-l" x="20" y="58" width="6" height="12" rx="2" fill="var(--copper)" />
          <rect className="sc-leg sc-leg-r" x="34" y="58" width="6" height="12" rx="2" fill="var(--copper)" />
          {/* arms */}
          <rect className="sc-arm sc-arm-l" x="9" y="36" width="6" height="16" rx="2.5" fill="var(--copper)" />
          <rect className="sc-arm sc-arm-r" x="45" y="36" width="6" height="16" rx="2.5" fill="var(--copper)" />
          {/* body */}
          <rect x="14" y="30" width="32" height="30" rx="7" fill="var(--pcb-1)" stroke="var(--line-bright)" strokeWidth="1.4" />
          {/* head */}
          <circle cx="30" cy="16" r="15" fill="var(--pcb-1)" stroke="var(--line-bright)" strokeWidth="1.4" />
          <circle cx="30" cy="2" r="2.2" fill="var(--copper)" className="sc-antenna" />
          <line x1="30" y1="4.5" x2="30" y2="9" stroke="var(--copper)" strokeWidth="1.4" />
          <g className={blink ? 'sc-eyes blink' : 'sc-eyes'}>
            <rect x="22" y="13" width="5.5" height={blink ? 1 : 5.5} rx="2" fill="var(--gold)" />
            <rect x="32.5" y="13" width="5.5" height={blink ? 1 : 5.5} rx="2" fill="var(--gold)" />
          </g>
        </svg>
      </div>

      <style>{`
        .scroll-companion{
          position: fixed;
          right: max(10px, env(safe-area-inset-right, 0px) + 6px);
          top: 0;
          left: auto;
          z-index: 45;
          pointer-events: none;
          transition: opacity .3s ease;
          will-change: transform;
        }
        @media (max-width: 640px){ .scroll-companion{ display: none; } }

        .scroll-companion-char{ will-change: transform; }
        .scroll-companion.is-pre-entrance .scroll-companion-char{
          transform: translate(18px, -46px) scale(0.4);
          opacity: 0;
        }
        .scroll-companion.is-entered .scroll-companion-char{
          animation: sc-jump-out .65s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes sc-jump-out{
          0%{ transform: translate(18px, -46px) scale(0.4); opacity: 0; }
          55%{ transform: translate(-6px, 4px) scale(1.08); opacity: 1; }
          100%{ transform: translate(0, 0) scale(1); opacity: 1; }
        }

        /* Hopping down: legs kick, arms pump, slight tilt each side */
        .sc-leg, .sc-arm{ transform-box: fill-box; transform-origin: top center; }
        .scroll-companion-char.hopping .sc-leg-l{ animation: sc-leg-kick 0.42s ease-in-out infinite; }
        .scroll-companion-char.hopping .sc-leg-r{ animation: sc-leg-kick 0.42s ease-in-out infinite reverse; }
        .scroll-companion-char.hopping .sc-arm-l{ animation: sc-arm-pump 0.42s ease-in-out infinite reverse; }
        .scroll-companion-char.hopping .sc-arm-r{ animation: sc-arm-pump 0.42s ease-in-out infinite; }
        @keyframes sc-leg-kick{ 0%,100%{ transform: rotate(0deg); } 50%{ transform: rotate(18deg); } }
        @keyframes sc-arm-pump{ 0%,100%{ transform: rotate(0deg); } 50%{ transform: rotate(-22deg); } }

        /* Climbing up: arms reach up alternately, legs scramble, body hugs in */
        .scroll-companion-char.climbing{ animation: sc-climb-sway 0.5s ease-in-out infinite; }
        .scroll-companion-char.climbing .sc-arm-l{ animation: sc-climb-reach 0.5s ease-in-out infinite; }
        .scroll-companion-char.climbing .sc-arm-r{ animation: sc-climb-reach 0.5s ease-in-out infinite reverse; }
        .scroll-companion-char.climbing .sc-leg-l{ animation: sc-leg-kick 0.3s ease-in-out infinite reverse; }
        .scroll-companion-char.climbing .sc-leg-r{ animation: sc-leg-kick 0.3s ease-in-out infinite; }
        @keyframes sc-climb-reach{ 0%,100%{ transform: rotate(-35deg); } 50%{ transform: rotate(5deg); } }
        @keyframes sc-climb-sway{ 0%,100%{ transform: rotate(-3deg); } 50%{ transform: rotate(3deg); } }

        .sc-antenna{ animation: sc-antenna-bob 2.2s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom center; }
        @keyframes sc-antenna-bob{ 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-1.4px); } }

        @media (prefers-reduced-motion: reduce){
          .scroll-companion.is-pre-entrance .scroll-companion-char,
          .scroll-companion.is-entered .scroll-companion-char{ animation: none; transform: none; opacity: 1; }
          .sc-antenna, .sc-leg, .sc-arm, .scroll-companion-char{ animation: none !important; }
        }
      `}</style>
    </div>
  )
}
