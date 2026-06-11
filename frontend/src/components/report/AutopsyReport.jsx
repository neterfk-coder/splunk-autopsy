const PRIORITY_COLORS = {
  high: '#E24B4A',
  medium: '#EF9F27',
  low: '#639922'
}

export default function AutopsyReport({ report }) {
  const {
    executive_summary,
    root_cause,
    estimated_impact,
    timeline_narrative,
    contributing_factors,
    corrective_actions,
    prevention
  } = report

  return (
    <div className="autopsy-report">
      <div className="report-header">
        <h2>Autopsy Report</h2>
        <span className="report-date">{new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
      </div>

      <section className="report-section">
        <h3>Executive summary</h3>
        <p>{executive_summary}</p>
      </section>

      <section className="report-section highlight-danger">
        <h3>Root cause</h3>
        <p>{root_cause}</p>
      </section>

      <section className="report-section highlight-warning">
        <h3>Estimated impact</h3>
        <p>{estimated_impact}</p>
      </section>

      <section className="report-section">
        <h3>What happened</h3>
        <p>{timeline_narrative}</p>
      </section>

      {contributing_factors?.length > 0 && (
        <section className="report-section">
          <h3>Contributing factors</h3>
          <ul className="factor-list">
            {contributing_factors.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {corrective_actions?.length > 0 && (
        <section className="report-section">
          <h3>Corrective actions</h3>
          <div className="actions-list">
            {corrective_actions.map((action, i) => (
              <div key={i} className="action-card">
                <span
                  className="action-priority"
                  style={{ background: PRIORITY_COLORS[action.priority] + '20', color: PRIORITY_COLORS[action.priority] }}
                >
                  {action.priority}
                </span>
                <p className="action-text">{action.action}</p>
                <span className="action-owner">{action.owner}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="report-section">
        <h3>Prevention</h3>
        <p>{prevention}</p>
      </section>
    </div>
  )
}
