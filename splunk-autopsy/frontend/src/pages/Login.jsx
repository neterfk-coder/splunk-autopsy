import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Zap, Mail, Lock, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Zap size={22} />
          <span>Splunk Autopsy</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>

        <div className="auth-form">
          <div className="input-group">
            <Mail size={15} className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
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
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
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
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="auth-links">
            <a href="/forgot-password" className="auth-link">Forgot password?</a>
            <span className="auth-divider">·</span>
            <a href="/register" className="auth-link">Create account</a>
          </div>
        </div>
      </div>
    </div>
  )
}
