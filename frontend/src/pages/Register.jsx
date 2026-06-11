import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Zap, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
    if (!email || !password || !name) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <Zap size={22} />
            <span>Splunk Autopsy</span>
          </div>
          <div className="auth-success">
            <CheckCircle size={40} color="#639922" />
            <h2>Check your email</h2>
            <p>We sent a confirmation link to <strong>{email}</strong></p>
            <a href="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center', marginTop: 20 }}>
              Go to login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Zap size={22} />
          <span>Splunk Autopsy</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start investigating your business data</p>

        <div className="auth-form">
          <div className="input-group">
            <User size={15} className="input-icon" />
            <input
              type="text"
              placeholder="Full name"
              className="auth-input"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Mail size={15} className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Lock size={15} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="auth-btn"
            onClick={handleRegister}
            disabled={loading || !email || !password || !name}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="auth-links">
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Already have an account?</span>
            <span className="auth-divider">·</span>
            <a href="/login" className="auth-link">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  )
}
