import { generalRules } from '../data/events'

export default function GeneralRules() {
  return (
    <section id="rules" className="py-20 md:py-24">
      <div className="wrap">
        <div className="mb-10 md:mb-14 reveal">
          <div className="sec-label">BEFORE YOU REGISTER</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)' }}>General Rules &amp; Guidelines</h2>
        </div>

        <div style={{ border: '1px solid var(--line-bright)' }}>
          {generalRules.map((rule, i) => (
            <div
              key={rule.title}
              className="reveal flex gap-5 md:gap-7 px-5 md:px-8 py-5 md:py-6"
              style={{ borderBottom: i < generalRules.length - 1 ? '1px solid var(--line)' : 'none' }}
            >
              <span className="font-mono text-sm md:text-base flex-shrink-0 pt-0.5" style={{ color: 'var(--ink-faint)', width: 28 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[15.5px] md:text-[17px] font-semibold mb-1.5" style={{ color: 'var(--gold)' }}>
                  {rule.title}
                </h3>
                <p className="text-[13.5px] md:text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
                  {rule.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
