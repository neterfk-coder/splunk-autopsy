import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Zap, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async () => {
    if (!email) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
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
            <h2>Email sent</h2>
            <p>Check your inbox for the password reset link</p>
            <a href="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center', marginTop: 20 }}>
              Back to login
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

        <h1 className="auth-title">Reset password</h1>
        <p className="auth-sub">Enter your email and we'll send you a reset link</p>

        <div className="auth-form">
          <div className="input-group">
            <Mail size={15} className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReset()}
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
            onClick={handleReset}
            disabled={loading || !email}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>

          <div className="auth-links">
            <a href="/login" className="auth-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowLeft size={13} /> Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
