import { useState } from 'react'
import { Search, Zap, AlertCircle } from 'lucide-react'
import { investigate } from '../lib/api'

const EXAMPLE_QUESTIONS = [
  "Why did conversions drop 40% on Tuesday between 2pm and 6pm?",
  "What caused the revenue spike on Friday morning?",
  "Why are payment failures up 3x compared to last week?",
  "What happened to checkout completion rates yesterday?"
]

export default function Dashboard({ onInvestigation }) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState('')

  const handleInvestigate = async () => {
    if (!question.trim()) return
    setLoading(true)
    setError(null)

    const steps = [
      'Decomposing business question...',
      'Generating investigative hypotheses...',
      'Executing parallel SPL queries...',
      'Scoring causal relationships...',
      'Building causal chain...',
      'Generating Autopsy Report...'
    ]

    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setStep(steps[i])
        i++
      }
    }, 1800)

    try {
      const result = await investigate(question)
      clearInterval(interval)
      onInvestigation(result)
    } catch (err) {
      clearInterval(interval)
      setError('Investigation failed. Check that the backend is running.')
    } finally {
      setLoading(false)
      setStep('')
    }
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">
          <Zap size={20} />
          <span>Splunk Autopsy</span>
        </div>
        <span className="tagline">Business forensics powered by AI</span>
      </header>

      <main className="main">
        <h1 className="headline">
          Why did your business<br />metrics drop?
        </h1>
        <p className="subheadline">
          Ask in plain English. Get a root cause report in seconds.
        </p>

        <div className="search-container">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Why did conversions drop on Tuesday?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleInvestigate()}
              disabled={loading}
            />
            <button
              className="search-btn"
              onClick={handleInvestigate}
              disabled={loading || !question.trim()}
            >
              {loading ? 'Investigating...' : 'Investigate'}
            </button>
          </div>

          {loading && (
            <div className="step-indicator">
              <div className="step-dot" />
              <span>{step}</span>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="examples">
          <p className="examples-label">Try an example</p>
          <div className="examples-grid">
            {EXAMPLE_QUESTIONS.map((q, i) => (
              <button
                key={i}
                className="example-btn"
                onClick={() => setQuestion(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="how-it-works">
          <div className="step-card">
            <span className="step-num">01</span>
            <p>Ask a business question in plain English</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <span className="step-num">02</span>
            <p>AI agent runs parallel Splunk queries</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <span className="step-num">03</span>
            <p>Causal chain built from technical events to business impact</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <span className="step-num">04</span>
            <p>Autopsy Report ready to share with your CEO</p>
          </div>
        </div>
      </main>
    </div>
  )
}
