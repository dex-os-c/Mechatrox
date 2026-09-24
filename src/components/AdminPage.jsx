import { useState } from 'react'

const FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-export`
  : ''

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
  padding: '9px 12px', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none',
}
const cellStyle = { borderBottom: '1px solid var(--line)', padding: '8px 10px', verticalAlign: 'top' }

export default function AdminPage() {
  const [id, setId] = useState('')
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
    if (!FUNCTION_URL) {
      setError('VITE_SUPABASE_URL is not set in this build.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
        },
        body: JSON.stringify({ id, password }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Login failed')
      setRows(body.data || [])
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pcb-0)', color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>
        <form onSubmit={login} style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Admin</h1>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" autoComplete="off" style={inputStyle} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={inputStyle} />
          {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn filled">{loading ? 'Checking…' : 'Log in'}</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pcb-0)', color: 'var(--ink)', fontFamily: 'var(--font-sans)', padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
        Registrations ({filtered.length}/{rows.length})
      </h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} style={inputStyle}>
          <option value="all">All events</option>
          {eventOptions.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
        </select>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-faint)' }}>
          From <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ ...inputStyle, marginLeft: 6 }} />
        </label>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-faint)' }}>
          To <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ ...inputStyle, marginLeft: 6 }} />
        </label>
        <button type="button" className="btn filled" onClick={exportCsv} disabled={!filtered.length}>
          Export CSV ({filtered.length})
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Team', 'College', 'Dept', 'Year', 'Events', 'Members', 'Submitted'].map((h) => (
                <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid var(--line-bright)', padding: '8px 10px', color: 'var(--copper-bright)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td style={cellStyle}>{r.team_name}</td>
                <td style={cellStyle}>{r.college}</td>
                <td style={cellStyle}>{r.department}</td>
                <td style={cellStyle}>{r.year}</td>
                <td style={cellStyle}>{(r.events || []).join(', ')}</td>
                <td style={cellStyle}>{(r.members || []).map((m) => m.name).filter(Boolean).join(', ')}</td>
                <td style={cellStyle}>{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={7} style={{ ...cellStyle, color: 'var(--ink-faint)' }}>No registrations match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
