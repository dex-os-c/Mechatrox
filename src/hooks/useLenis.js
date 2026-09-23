import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// On mobile, the browser chrome (address bar) showing/hiding shrinks and grows the
// viewport as you scroll, which by default makes ScrollTrigger recalculate all its
// start/end positions mid-scroll — this is what makes scroll-scrubbed animations
// (like the hero's mech entrance) jump or desync on phones. This flag tells it to
// ignore viewport-height changes caused by that chrome, not by real resizes/rotation.
ScrollTrigger.config({ ignoreMobileResize: true })

export function useLenis() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])
}
