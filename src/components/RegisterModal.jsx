import { useEffect, useRef, useState } from 'react'
import { technicalEvents, nonTechnicalEvents, eventInfo } from '../data/events'
import { submitRegistration } from '../lib/api'

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

const MEMBER_SLOTS = [
  { key: 'm1', label: 'Team Lead', required: true },
  { key: 'm2', label: 'Member 2', required: false },
  { key: 'm3', label: 'Member 3', required: false },
  { key: 'm4', label: 'Member 4', required: false },
]

const emptyMember = { name: '', mobile: '', email: '' }

function validMobile(v) { return /^[0-9]{10}$/.test(v) }
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

export default function RegisterModal({ open, onClose }) {
  const panelRef = useRef(null)

  const [teamName, setTeamName] = useState('')
  const [college, setCollege] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [members, setMembers] = useState({ m1: { ...emptyMember }, m2: { ...emptyMember }, m3: { ...emptyMember }, m4: { ...emptyMember } })
  const [techEvent, setTechEvent] = useState('')
  const [nontechEvent, setNontechEvent] = useState('')
  const [openDesc, setOpenDesc] = useState(null)
  const [errors, setErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('locked')
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('locked')
    }
  }, [open, onClose])

  if (!open) return null

  const setMemberField = (key, field, value) => {
    setMembers((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  const resetForm = () => {
    setTeamName(''); setCollege(''); setDepartment(''); setYear('')
    setMembers({ m1: { ...emptyMember }, m2: { ...emptyMember }, m3: { ...emptyMember }, m4: { ...emptyMember } })
    setTechEvent(''); setNontechEvent('')
    setErrors([]); setSubmitted(false)
  }

  const handleClose = () => { onClose(); setTimeout(resetForm, 300) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = []
    if (!teamName.trim()) errs.push('Team name is required.')
    if (!college.trim()) errs.push('College / institution is required.')
    if (!department.trim()) errs.push('Department is required.')
    if (!year) errs.push('Year of study is required.')

    MEMBER_SLOTS.forEach(({ key, label, required }) => {
      const m = members[key]
      const anyFilled = m.name || m.mobile || m.email
      if (required || anyFilled) {
        if (!m.name.trim()) errs.push(`${label}: name is required.`)
        if (!validMobile(m.mobile)) errs.push(`${label}: enter a valid 10-digit mobile number.`)
        if (!validEmail(m.email)) errs.push(`${label}: enter a valid email address.`)
      }
    })

    if (!techEvent) errs.push('Select one Technical event.')
    if (!nontechEvent) errs.push('Select one Non-technical event.')

    setErrors(errs)
    if (errs.length) return

    const filledMembers = MEMBER_SLOTS
      .map(({ key, label }) => ({ role: label, ...members[key] }))
      .filter((m) => m.name.trim())

    setSubmitting(true)
    try {
      await submitRegistration({
        team_name: teamName,
        college,
        department,
        year,
        members: filledMembers,
        events: [techEvent, nontechEvent],
      })
      setSubmitted(true)
    } catch {
      setErrors(['Something went wrong sending your registration. Please check your connection and try again.'])
    } finally {
      setSubmitting(false)
    }
  }

  const toggleDesc = (key) => setOpenDesc((cur) => (cur === key ? null : key))

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      style={{ background: 'rgba(4,16,13,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="event-modal relative w-full md:max-w-[640px] max-h-[92dvh] overflow-y-auto"
        style={{ background: 'var(--pcb-0)', border: '1px solid var(--line-bright)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center z-10"
          style={{ border: '1px solid var(--line-bright)', color: 'var(--ink-dim)', background: 'var(--pcb-1)' }}
          aria-label="Close"
          onClick={handleClose}
        >
          ✕
        </button>

        {submitted ? (
          <div className="px-7 pt-10 pb-12 md:px-10 text-center">
            <p className="eyebrow mb-3">REGISTRATION COMPLETE</p>
            <h3 className="font-bold leading-[0.98] mb-4" style={{ fontSize: 'clamp(26px,4.5vw,38px)' }}>
              You're in, {teamName || 'team'}.
            </h3>
            <p className="text-[15px] leading-relaxed max-w-[440px] mx-auto" style={{ color: 'var(--ink-dim)' }}>
              This form only registers interest — it doesn't collect payment. Entry fee ({eventInfo.entry}) will be
              collected after registration, through online or offline mode.
            </p>

            <a
              href="https://chat.whatsapp.com/CE3R5yu0iuE4ZMToiosJMu"
              target="_blank"
              rel="noopener"
              className="mt-8 inline-flex items-center gap-2.5"
              style={{ background: '#25D366', color: '#04100D', padding: '11px 22px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}
            >
              <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 5L2 22l5.25-1.38c1.44.79 3.06 1.2 4.79 1.2 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 1.67c4.55 0 8.24 3.69 8.24 8.24s-3.69 8.24-8.24 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.7-8.24 8.24-8.24M8.53 6.7c-.16 0-.42.06-.64.31-.22.24-.85.83-.85 2.03 0 1.2.87 2.35.99 2.51.12.16 1.7 2.67 4.18 3.7.58.26 1.04.41 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.16s.2-1.06.14-1.16c-.06-.1-.22-.16-.46-.28s-1.45-.72-1.68-.8-.38-.12-.55.12-.63.8-.78.96-.29.19-.53.06c-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.02-.37.11-.5.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47Z"/></svg>
              Join our WhatsApp community
            </a>

            <button type="button" className="block mx-auto mt-6 font-mono text-[12px]" style={{ color: 'var(--copper-bright)' }} onClick={resetForm}>
              Register another team
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 pt-8 pb-9 md:px-10 md:pt-10">
            <p className="eyebrow mb-3">REGISTER YOUR TEAM</p>
            <h3 id="register-modal-title" className="font-bold leading-[0.98] mb-3" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>
              {eventInfo.festName}
            </h3>
            <p className="font-mono text-[11.5px] tracking-[0.06em] mb-8" style={{ color: 'var(--ink-faint)' }}>
              {eventInfo.date} ({eventInfo.day}) · {eventInfo.venue} · {eventInfo.entry}
            </p>

            {errors.length > 0 && (
              <div className="mb-7 px-4 py-3" style={{ border: `1px solid var(--danger)`, background: 'rgba(226,84,58,0.08)' }}>
                {errors.map((err, i) => (
                  <p key={i} className="text-[13px]" style={{ color: 'var(--danger)' }}>{err}</p>
                ))}
              </div>
            )}

            <div className="reg-field">
              <label className="reg-label">Team name *</label>
              <input className="reg-input" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Your answer" />
            </div>

            <div className="reg-field">
              <label className="reg-label">College / institution *</label>
              <input className="reg-input" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Your answer" />
            </div>

            <div className="reg-field">
              <label className="reg-label">Department *</label>
              <input className="reg-input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Your answer" />
            </div>

            <div className="reg-field">
              <label className="reg-label">Year of study *</label>
              <div className="flex gap-2 flex-wrap mt-2">
                {YEARS.map((y) => (
                  <button
                    key={y} type="button"
                    className="reg-pill"
                    data-active={year === y}
                    onClick={() => setYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {MEMBER_SLOTS.map(({ key, label, required }) => (
              <div key={key} className="reg-member-block">
                <p className="reg-member-title">{label}{required ? ' *' : ''}</p>
                {!required && <p className="reg-member-sub">Optional — leave blank if your team doesn't have this member.</p>}
                <div className="reg-field">
                  <label className="reg-label">Name{required ? ' *' : ''}</label>
                  <input className="reg-input" value={members[key].name} onChange={(e) => setMemberField(key, 'name', e.target.value)} placeholder="Your answer" />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Mobile no.{required ? ' *' : ''}</label>
                  <input className="reg-input" value={members[key].mobile} onChange={(e) => setMemberField(key, 'mobile', e.target.value)} placeholder="Your answer" inputMode="numeric" />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Email{required ? ' *' : ''}</label>
                  <input className="reg-input" value={members[key].email} onChange={(e) => setMemberField(key, 'email', e.target.value)} placeholder="Your answer" type="email" />
                </div>
              </div>
            ))}

            <div className="reg-field">
              <label className="reg-label">Events * <span className="reg-hint">— choose 1 Technical and 1 Non-technical</span></label>

              <p className="reg-group-label mt-4">Technical</p>
              {technicalEvents.map((ev) => (
                <div key={ev.key}>
                  <div className="reg-opt-row">
                    <button type="button" className="reg-opt" onClick={() => setTechEvent(ev.title)}>
                      <span className="reg-radio" data-active={techEvent === ev.title} />
                      {ev.title}
                    </button>
                    <button type="button" className="reg-info-btn" aria-label={`What is ${ev.title}?`} onClick={() => toggleDesc(`tech-${ev.key}`)}>ⓘ</button>
                  </div>
                  {openDesc === `tech-${ev.key}` && <p className="reg-desc">{ev.desc}</p>}
                </div>
              ))}

              <p className="reg-group-label mt-5">Non-technical</p>
              {nonTechnicalEvents.map((ev) => (
                <div key={ev.key}>
                  <div className="reg-opt-row">
                    <button type="button" className="reg-opt" onClick={() => setNontechEvent(ev.title)}>
                      <span className="reg-radio" data-active={nontechEvent === ev.title} />
                      {ev.title}
                    </button>
                    <button type="button" className="reg-info-btn" aria-label={`What is ${ev.title}?`} onClick={() => toggleDesc(`nontech-${ev.key}`)}>ⓘ</button>
                  </div>
                  {openDesc === `nontech-${ev.key}` && <p className="reg-desc">{ev.desc}</p>}
                </div>
              ))}
            </div>

            <p className="text-[12.5px] leading-relaxed mt-8" style={{ color: 'var(--ink-faint)' }}>
              This form is only to register interested participants — it doesn't collect payment. Entry fee
              ({eventInfo.entry}) will be collected after registration, through online or offline mode.
            </p>

            <button type="submit" className="btn filled mt-7" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
