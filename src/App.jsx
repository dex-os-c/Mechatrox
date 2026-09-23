import { useEffect, useState } from 'react'
import ScrollTrigger from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Lineup from './components/Lineup'
import About from './components/About'
import EventsSection from './components/EventsSection'
import Footer from './components/Footer'
import { technicalEvents, nonTechnicalEvents } from './data/events'
import { useLenis } from './hooks/useLenis'

export default function App() {
  const [ready, setReady] = useState(false)
  useLenis()

  useEffect(() => {
    document.body.classList.toggle('locked', !ready)
  }, [ready])

  useEffect(() => {
    if (!ready) return undefined

    const registered = new WeakSet()
    const registerReveal = (el) => {
      if (registered.has(el)) return
      registered.add(el)
      gsap.set(el, { opacity: 0, y: 26 })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }),
      })
    }

    const ctx = gsap.context(() => {
      document.querySelectorAll('.reveal').forEach(registerReveal)
    })

    // .reveal elements inside lazy-loaded chunks (e.g. HeroCanvas,
    // LineupCanvas) don't exist yet on first pass — watch the DOM so they
    // still get wired up once their chunk mounts.
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return
          if (node.matches?.('.reveal')) registerReveal(node)
          node.querySelectorAll?.('.reveal').forEach(registerReveal)
        })
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [ready])

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <Navbar />
      <Hero ready={ready} />
      <Marquee />
      <Lineup />
      <About />
      <EventsSection
        id="events-technical"
        trackLabel="TRACK 01"
        title="Technical Events"
        sub="Hardware, design, and the kind of pressure that only comes from a demo that has to actually run."
        events={technicalEvents}
      />
      <EventsSection
        id="events-nontechnical"
        trackLabel="TRACK 02"
        title="Non-Technical Events"
        sub="No soldering iron required. Bring a team, an opinion, or both."
        events={nonTechnicalEvents}
      />
      <Footer />
    </>
  )
}
