import { lazy, Suspense, useEffect, useState } from 'react'
import ScrollTrigger from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Marquee from './components/Marquee'
import About from './components/About'
import EventsSection from './components/EventsSection'
import Footer from './components/Footer'
import ScrollCompanion from './components/ScrollCompanion'
import EventDetailModal from './components/EventDetailModal'
import { technicalEvents, nonTechnicalEvents } from './data/events'
import { useLenis } from './hooks/useLenis'

// Hero and Lineup are the only two consumers of three.js / @react-three/fiber / drei.
// Splitting them into their own chunk keeps the main bundle well under the 500kB warning
// instead of shipping the whole 3D stack in the initial payload.
const Hero = lazy(() => import('./components/Hero'))
const Lineup = lazy(() => import('./components/Lineup'))

export default function App() {
  const [ready, setReady] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  useLenis()

  useEffect(() => {
    document.body.classList.toggle('locked', !ready)
  }, [ready])

  // Reveal setup uses a MutationObserver rather than a one-time DOM query, because
  // Hero/Lineup mount asynchronously (lazy chunks) and their .reveal elements may not
  // exist yet at the instant `ready` flips true.
  useEffect(() => {
    if (!ready) return undefined
    const seen = new WeakSet()

    const wire = (el) => {
      if (seen.has(el)) return
      seen.add(el)
      gsap.set(el, { opacity: 0, y: 26 })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }),
      })
    }

    document.querySelectorAll('.reveal').forEach(wire)

    const observer = new MutationObserver(() => {
      document.querySelectorAll('.reveal').forEach(wire)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [ready])

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <ScrollCompanion />
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
        <Hero ready={ready} />
      </Suspense>
      <Marquee />
      <Suspense fallback={<div style={{ minHeight: '520px' }} />}>
        <Lineup onSelect={setSelectedEvent} />
      </Suspense>
      <About />
      <EventsSection
        id="events-technical"
        trackLabel="TRACK 01"
        title="Technical Events"
        sub="Hardware, design, and the kind of pressure that only comes from a demo that has to actually run."
        events={technicalEvents}
        onSelect={setSelectedEvent}
      />
      <EventsSection
        id="events-nontechnical"
        trackLabel="TRACK 02"
        title="Non-Technical Events"
        sub="No soldering iron required. Bring a team, an opinion, or both."
        events={nonTechnicalEvents}
        onSelect={setSelectedEvent}
      />
      <Footer />
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  )
}
