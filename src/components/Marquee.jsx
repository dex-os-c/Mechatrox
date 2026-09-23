import { technicalEvents, nonTechnicalEvents } from '../data/events'

export default function Marquee() {
  const items = [...technicalEvents, ...nonTechnicalEvents].map((e) => e.title.toUpperCase())
  const line = items.join(' — ')

  return (
    <div className="marquee-mask">
      <div className="marquee-track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  )
}
