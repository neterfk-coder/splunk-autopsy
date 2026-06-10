import { useState, useEffect } from "react";
import { Search, Zap, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { investigate } from "../lib/api";
import {
  saveInvestigation,
  logActivity,
  getInvestigations,
  updateLastSeen,
} from "../lib/supabase";

const EXAMPLE_QUESTIONS = [
  "Why did conversions drop 40% on Tuesday between 2pm and 6pm?",
  "What caused the revenue spike on Friday morning?",
  "Why are payment failures up 3x compared to last week?",
  "What happened to checkout completion rates yesterday?",
];

export default function Dashboard({ onInvestigation, session }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      updateLastSeen(session.user.id);
      loadHistory();
      logActivity(session.user.id, "page_view", {}, "/");
    }
  }, [session]);

  const loadHistory = async () => {
    const data = await getInvestigations(session.user.id);
    setHistory(data);
  };

  const handleInvestigate = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);

    const steps = [
      "Decomposing business question...",
      "Generating investigative hypotheses...",
      "Executing parallel SPL queries...",
      "Scoring causal relationships...",
      "Building causal chain...",
      "Generating Autopsy Report...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setStep(steps[i]);
        i++;
      }
    }, 1800);

    try {
      // Log que el usuario hizo una investigación
      await logActivity(
        session.user.id,
        "investigation_started",
        { question },
        "/",
      );

      const result = await investigate(question);
      clearInterval(interval);

      // Guardar investigación en Supabase
      await saveInvestigation(session.user.id, question, result);

      // Log que la investigación terminó
      await logActivity(
        session.user.id,
        "investigation_completed",
        {
          question,
          investigation_id: result.investigation_id,
          queries_executed: result.queries_executed,
        },
        "/",
      );

      // Recargar historial
      await loadHistory();

      onInvestigation(result);
    } catch (err) {
      clearInterval(interval);
      setError("Investigation failed. Check that the backend is running.");
      await logActivity(
        session.user.id,
        "investigation_failed",
        { question, error: err.message },
        "/",
      );
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  const handleSignOut = async () => {
    const { supabase } = await import("../lib/supabase");
    await logActivity(session.user.id, "sign_out", {}, "/");
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">
          <Zap size={20} />
          <span>Splunk Autopsy</span>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {session?.user?.email}
          </span>
          <button
            onClick={handleSignOut}
            style={{
              background: "none",
              border: "0.5px solid var(--border)",
              color: "var(--text-muted)",
              fontSize: 13,
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="main">
        <h1 className="headline">
          Why did your business
          <br />
          metrics drop?
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
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvestigate()}
              disabled={loading}
            />
            <button
              className="search-btn"
              onClick={handleInvestigate}
              disabled={loading || !question.trim()}
            >
              {loading ? "Investigating..." : "Investigate"}
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

        {history.length > 0 && (
          <div style={{ width: "100%", marginBottom: 32 }}>
            <p className="examples-label">Recent investigations</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.slice(0, 5).map((inv, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--surface)",
                    border: "0.5px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Clock
                    size={14}
                    style={{ color: "var(--text-muted)", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, flex: 1, color: "var(--text)" }}>
                    {inv.question}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-hint)" }}>
                    {new Date(inv.created_at).toLocaleDateString()}
                  </span>
                  <ChevronRight
                    size={14}
                    style={{ color: "var(--text-hint)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
  );
}
