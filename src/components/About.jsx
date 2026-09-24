import { eventInfo } from '../data/events'

export default function About() {
  return (
    <section id="about" className="py-16 md:py-28">
      <div className="wrap grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-start">
        <div className="reveal">
          <div className="sec-label">ABOUT</div>
          <p style={{ fontSize: 'clamp(20px,2.6vw,28px)', lineHeight: 1.45 }}>
            Run entirely by the <b style={{ color: 'var(--gold)', fontWeight: 600 }}>{eventInfo.department}</b> at{' '}
            {eventInfo.college} ({eventInfo.collegeShort}), {eventInfo.festName} brings eight events under one roof —
            four for people who want to design, present, and debug real hardware, and four for people who just want
            to compete, bid, and argue about their fantasy XI.
          </p>
        </div>
        <div className="datasheet reveal">
          <div className="head">EVENT SPEC</div>
          <div className="row"><span className="k">FORMAT</span><span className="v">2 tracks · 8 events</span></div>
          <div className="row"><span className="k">DATE</span><span className="v">{eventInfo.date} ({eventInfo.day})</span></div>
          <div className="row"><span className="k">VENUE</span><span className="v">{eventInfo.venue}</span></div>
          <div className="row"><span className="k">ENTRY</span><span className="v">{eventInfo.entry}</span></div>
          <div className="row"><span className="k">COLLEGE</span><span className="v">{eventInfo.collegeShort}</span></div>
        </div>
      </div>
    </section>
  )
}
