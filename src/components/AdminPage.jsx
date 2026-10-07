import { useState } from 'react'
import { fetchRegistrations } from '../lib/api'

function csvCell(v) {
  return `"${String(v ?? '').replace(/"/g, '""')}"`
}

function toCsv(rows) {
  const header = ['team_name', 'college', 'department', 'year', 'events', 'member_role', 'member_name', 'member_mobile', 'member_email', 'submitted_at']
  const lines = [header.join(',')]
  rows.forEach((r) => {
    const base = [r.team_name, r.college, r.department, r.year, (r.events || []).join('; ')]
    const members = Array.isArray(r.members) && r.members.length ? r.members : [{}]
    members.forEach((m) => {
      lines.push([...base, m.role || '', m.name || '', m.mobile || '', m.email || '', r.created_at].map(csvCell).join(','))
    })
  })
  return lines.join('\n')
}

function download(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const inputStyle = {
  background: 'var(--pcb-1)', border: '1px solid var(--line-bright)', color: 'var(--ink)',
  padding: '10px 13px', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none',
}
const cellStyle = { borderBottom: '1px solid var(--line)', padding: '12px 16px', verticalAlign: 'top', whiteSpace: 'nowrap' }
const headStyle = {
  textAlign: 'left', padding: '12px 16px', color: 'var(--copper-bright)',
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
  background: 'var(--pcb-1)', borderBottom: '1px solid var(--line-bright)',
  position: 'sticky', top: 0, whiteSpace: 'nowrap',
}

export default function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [eventFilter, setEventFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const login = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await fetchRegistrations({ username, password })
      setRows(data)
      setAuthed(true)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const eventOptions = Array.from(new Set(rows.flatMap((r) => r.events || [])))

  const filtered = rows.filter((r) => {
    if (eventFilter !== 'all' && !(r.events || []).includes(eventFilter)) return false
    if (fromDate && new Date(r.created_at) < new Date(fromDate)) return false
    if (toDate && new Date(r.created_at) > new Date(`${toDate}T23:59:59`)) return false
    return true
  })

  const exportCsv = () => download(`mechatrox-registrations-${Date.now()}.csv`, toCsv(filtered))

  if (!authed) {
    return (
      <div
        style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--pcb-0)', color: 'var(--ink)', fontFamily: 'var(--font-sans)',
          backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '64px 64px', padding: 20,
        }}
      >
        <form
          onSubmit={login}
          style={{
            width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14,
            border: '1px solid var(--line-bright)', background: 'var(--pcb-1)', padding: '32px 28px',
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', margin: 0, color: 'var(--gold)' }}>
              MECHATROX ADMIN
            </h1>
            <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: '4px 0 0' }}>Registration dashboard — authorised access only.</p>
          </div>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoComplete="off" style={inputStyle} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={inputStyle} />
          {error && <div style={{ color: 'var(--danger)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn filled">{loading ? 'Checking…' : 'Log in'}</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pcb-0)', color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(20px, 4vw, 48px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', margin: 0, color: 'var(--gold)' }}>
              MECHATROX ADMIN
            </h1>
            <p style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', fontWeight: 600, margin: '6px 0 0' }}>
              Registrations <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>({filtered.length}/{rows.length})</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center', border: '1px solid var(--line)', background: 'var(--pcb-1)', padding: 16 }}>
          <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} style={inputStyle}>
            <option value="all">All events</option>
            {eventOptions.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-faint)' }}>
            From <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-faint)' }}>
            To <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
          </label>
          <button type="button" className="btn filled" onClick={exportCsv} disabled={!filtered.length} style={{ marginLeft: 'auto' }}>
            Export CSV ({filtered.length})
          </button>
        </div>

        <div style={{ border: '1px solid var(--line-bright)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', maxHeight: '70vh' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Team', 'College', 'Dept', 'Year', 'Events', 'Members', 'Submitted'].map((h) => (
                    <th key={h} style={headStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 ? 'var(--pcb-1)' : 'transparent' }}>
                    <td style={{ ...cellStyle, color: 'var(--ink)', fontWeight: 600 }}>{r.team_name}</td>
                    <td style={cellStyle}>{r.college}</td>
                    <td style={cellStyle}>{r.department}</td>
                    <td style={cellStyle}>{r.year}</td>
                    <td style={cellStyle}>{(r.events || []).join(', ')}</td>
                    <td style={cellStyle}>{(r.members || []).map((m) => m.name).filter(Boolean).join(', ')}</td>
                    <td style={{ ...cellStyle, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {r.created_at ? new Date(r.created_at).toLocaleString() : ''}
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={7} style={{ ...cellStyle, color: 'var(--ink-faint)', textAlign: 'center', whiteSpace: 'normal' }}>No registrations match these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
