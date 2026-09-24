import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return undefined
    let mx = 0, my = 0, rx = 0, ry = 0
    let raf

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px'
        dotRef.current.style.top = my + 'px'
      }
    }
    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px'
        ringRef.current.style.top = ry + 'px'
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)

    const grow = () => {
      if (!ringRef.current) return
      ringRef.current.style.width = '44px'
      ringRef.current.style.height = '44px'
      ringRef.current.style.borderColor = '#EDEAE0'
    }
    const shrink = () => {
      if (!ringRef.current) return
      ringRef.current.style.width = '26px'
      ringRef.current.style.height = '26px'
      ringRef.current.style.borderColor = '#FF1E1E'
    }
    const targets = document.querySelectorAll('a, button, .card, .lineup-item')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[26px] h-[26px] rounded-full pointer-events-none z-[80] hidden md:block"
        style={{ border: '1px solid var(--gold)', transform: 'translate(-50%,-50%)', transition: 'width .25s ease,height .25s ease,border-color .25s ease', mixBlendMode: 'difference' }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 rounded-full pointer-events-none z-[81] hidden md:block"
        style={{ background: 'var(--gold)', transform: 'translate(-50%,-50%)' }}
      />
    </>
  )
}
