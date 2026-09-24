import { useEffect, useRef } from 'react'

export default function EventDetailModal({ event, onClose, onOpenRegister }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!event) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('locked')
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('locked')
    }
  }, [event, onClose])

  if (!event) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      style={{ background: 'rgba(4,16,13,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="event-modal relative w-full md:max-w-[620px] max-h-[86dvh] overflow-y-auto"
        style={{ background: 'var(--pcb-0)', border: '1px solid var(--line-bright)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center z-10"
          style={{ border: '1px solid var(--line-bright)', color: 'var(--ink-dim)', background: 'var(--pcb-1)' }}
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="px-7 pt-8 pb-2 md:px-10 md:pt-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="card-code">{event.code}</span>
            <span className="card-tag">{event.tag}</span>
          </div>
          <h3 id="event-modal-title" className="font-bold leading-[0.98]" style={{ fontSize: 'clamp(30px,5vw,46px)' }}>
            {event.title}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed max-w-[480px]" style={{ color: 'var(--ink-dim)' }}>
            {event.desc}
          </p>
        </div>

        <div className="datasheet reveal-none mx-7 md:mx-10 mt-6 mb-9" style={{ borderColor: 'var(--line-bright)' }}>
          <div className="head">HOW IT WORKS</div>
          {(event.details || []).map((line, i) => (
            <div className="row" key={i}>
              <span className="k">{String(i + 1).padStart(2, '0')}</span>
              <span className="v" style={{ textAlign: 'left', maxWidth: '78%' }}>{line}</span>
            </div>
          ))}
        </div>

        <div className="px-7 md:px-10 pb-9">
          <button type="button" className="btn filled" onClick={() => { onClose(); onOpenRegister() }}>Register for this event</button>
        </div>
      </div>
    </div>
  )
}
