import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { RobotModel, NetworkField } from '../three/Hero3D'
import { eventInfo } from '../data/events'

export default function Hero({ ready }) {
  const lineRefs = useRef([])

  useEffect(() => {
    if (!ready) return
    const tl = gsap.timeline({ delay: 0.1 })
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to('.hero-line span', { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, '-=0.3')
      .to('.hero-accent', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.hero-scroll', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .to('.hero-tap-hint', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  }, [ready])

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-end pt-[78px]">
      <div className="absolute inset-0 z-0 opacity-95">
        <Canvas camera={{ position: [1.2, 1.3, 5.2], fov: 42 }} dpr={[1, 1.6]}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 2]} intensity={0.9} />
          <pointLight position={[-2, 1.5, 2]} color="#D9A441" intensity={1.6} />
          <pointLight position={[2, -1, -2]} color="#C97A4A" intensity={1} />
          <Suspense fallback={null}>
            <NetworkField />
            <RobotModel />
          </Suspense>
        </Canvas>
      </div>
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(4,16,13,0.1) 0%, rgba(4,16,13,0.5) 55%, var(--pcb-0) 100%)' }}
      />

      <div className="relative z-[2] wrap w-full">
        <div className="hero-eyebrow eyebrow mb-5" style={{ opacity: 0, transform: 'translateY(16px)' }}>
          {eventInfo.department.toUpperCase()} · {eventInfo.collegeShort.toUpperCase()}
        </div>

        <h1 className="font-bold leading-[0.94] max-w-3xl" style={{ fontSize: 'clamp(44px, 9vw, 108px)' }}>
          <div className="overflow-hidden hero-line">
            <span className="reveal-span" style={{ transform: 'translateY(110%)' }}>BUILD IT.</span>
          </div>
          <div className="overflow-hidden hero-line">
            <span className="reveal-span outline-text" style={{ transform: 'translateY(110%)' }}>BREAK IT.</span>
          </div>
          <span
            className="hero-accent block mt-3.5 text-[0.36em]"
            style={{ color: 'var(--ink-dim)', opacity: 0, transform: 'translateY(16px)' }}
          >
            then fix it, live, on a clock.
          </span>
        </h1>

        <p className="hero-sub max-w-xl mt-6 text-base leading-relaxed" style={{ color: 'var(--ink-dim)', opacity: 0, transform: 'translateY(16px)' }}>
          {eventInfo.festName} is the {eventInfo.department}'s annual symposium at {eventInfo.college} — five technical
          events for people who'd rather solder, model, and debug than sit through another lecture, and five
          non-technical ones for everyone else in the room.
        </p>

        <div className="hero-cta flex gap-4 flex-wrap mt-9" style={{ opacity: 0, transform: 'translateY(16px)' }}>
          <a href="#lineup" className="btn filled">See the events</a>
          <a href="#contact" className="btn">Register your team</a>
        </div>

        <div className="hero-scroll flex items-center gap-2.5 my-11 font-mono text-[11px] tracking-[0.12em]" style={{ color: 'var(--ink-faint)', opacity: 0, transform: 'translateY(16px)' }}>
          <span className="relative w-px h-8 overflow-hidden inline-block" style={{ background: 'var(--ink-faint)' }}>
            <span className="absolute left-0 w-full h-full animate-[scrollbar_1.8s_ease-in-out_infinite]" style={{ background: 'var(--gold)' }} />
          </span>
          SCROLL
        </div>
      </div>

      <div
        className="hero-tap-hint absolute right-6 md:right-10 z-[2] font-mono text-[10px] tracking-[0.1em] hidden sm:block"
        style={{ bottom: '28px', color: 'var(--ink-faint)', opacity: 0, transform: 'translateY(16px)' }}
      >
        TAP THE BOT ↝
      </div>

      <style>{`
        @keyframes scrollbar { 0%{ top:-100%; } 50%{ top:0; } 100%{ top:100%; } }
      `}</style>
    </section>
  )
}
