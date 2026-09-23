export default function EventsSection({ id, trackLabel, title, sub, events }) {
  return (
    <section id={id} className="py-16 md:py-28">
      <div className="wrap">
        <div className="flex justify-between items-end gap-10 mb-14 flex-wrap reveal">
          <div>
            <div className="sec-label">{trackLabel}</div>
            <h2 style={{ fontSize: 'clamp(32px,4.4vw,52px)' }}>{title}</h2>
          </div>
          <p className="max-w-[360px] text-[15px] leading-relaxed pb-1.5" style={{ color: 'var(--ink-dim)' }}>{sub}</p>
        </div>
        <div className="grid-events">
          {events.map((ev) => (
            <div key={ev.code} className="card reveal">
              <div className="flex justify-between items-start mb-3.5">
                <span className="card-code">{ev.code}</span>
                <span className="card-tag">{ev.tag}</span>
              </div>
              <h3 className="text-[22px] mb-2.5">{ev.title}</h3>
              <p className="text-[14.5px] leading-relaxed max-w-[420px]" style={{ color: 'var(--ink-dim)' }}>{ev.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
