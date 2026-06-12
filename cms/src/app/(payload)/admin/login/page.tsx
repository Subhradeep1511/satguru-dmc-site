'use client'
import React, { Suspense, useState } from 'react'

/* ── tiny inline SVG icons ───────────────────────────────────── */
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)


const inputCss: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem 1rem',
  background: '#fff',
  border: '1.5px solid #e2e8f0',
  borderRadius: '10px',
  color: '#1a1a2e',
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}
const labelCss: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.45rem',
  color: '#374151',
  fontSize: '0.9rem',
  fontWeight: 500,
}
const btnPrimary = (disabled: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '0.9rem',
  background: disabled ? '#555' : '#1a1a2e',
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'inherit',
  letterSpacing: '0.01em',
})

function AuthForms() {
  /* login */
  const [lEmail, setLEmail] = useState('')
  const [lPwd, setLPwd] = useState('')
  const [showLPwd, setShowLPwd] = useState(false)
  const [lErr, setLErr] = useState('')
  const [lLoading, setLLoading] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLErr('')
    setLLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: lEmail, password: lPwd }),
      })
      if (res.ok) {
        window.location.href = '/admin'
      } else {
        const d = await res.json()
        setLErr(d?.errors?.[0]?.message || d?.message || 'Invalid email or password')
      }
    } catch {
      setLErr('Network error. Please try again.')
    } finally {
      setLLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 1rem 1rem' }}>
      {/* Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <img src="/satguru-logo.gif" alt="Satguru DMC" style={{ height: '70px', width: 'auto' }} />
      </div>

      {/* ── LOGIN FORM ── */}
      <form onSubmit={login}>
          {lErr && <ErrorBox msg={lErr} />}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelCss}>Email address</label>
            <input type="email" value={lEmail} onChange={e => setLEmail(e.target.value)}
              placeholder="Enter your email address" required style={inputCss} />
          </div>
          <div style={{ marginBottom: '1.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ ...labelCss, marginBottom: 0 }}>Password</label>
              <a href="/admin/forgot" style={{ color: '#6C63FF', fontSize: '0.85rem' }}>
                Forgot password?
              </a>
            </div>
            <PasswordInput value={lPwd} onChange={setLPwd} show={showLPwd} toggle={() => setShowLPwd(p => !p)}
              placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={lLoading} style={btnPrimary(lLoading)}>
            {lLoading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
    </div>
  )
}

/* ── helpers ────────────────────────────────────────────────── */
function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{
      background: 'rgba(239,68,68,0.07)',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      padding: '0.65rem 1rem',
      marginBottom: '1rem',
      color: '#dc2626',
      fontSize: '0.85rem',
      textAlign: 'center',
    }}>{msg}</div>
  )
}

function PasswordInput({ value, onChange, show, toggle, placeholder }: {
  value: string; onChange: (v: string) => void; show: boolean; toggle: () => void; placeholder: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required
        style={{ ...inputCss, paddingRight: '3rem' }} />
      <button type="button" onClick={toggle}
        style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
        {show ? <EyeOpen /> : <EyeClosed />}
      </button>
    </div>
  )
}

/* ── page root ──────────────────────────────────────────────── */
export default function LoginPage() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#ffffff',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowY: 'auto',
    }}>
      <Suspense fallback={null}>
        <AuthForms />
      </Suspense>
    </div>
  )
}
