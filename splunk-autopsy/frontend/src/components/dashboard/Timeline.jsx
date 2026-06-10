const TYPE_LABELS = {
  root_cause: { label: 'Root cause', color: '#E24B4A' },
  contributing_factor: { label: 'Contributing factor', color: '#EF9F27' },
  effect: { label: 'Effect', color: '#378ADD' }
}

export default function Timeline({ events }) {
  if (!events.length) {
    return <div className="empty-state">No timeline events found.</div>
  }

  return (
    <div className="timeline">
      {events.map((event, i) => {
        const meta = TYPE_LABELS[event.type] || { label: event.type, color: '#888' }
        return (
          <div key={i} className="timeline-item">
            <div className="timeline-marker" style={{ background: meta.color }} />
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-order">{event.order}</span>
                <span className="timeline-type" style={{ color: meta.color }}>
                  {meta.label}
                </span>
                <span className="timeline-confidence">
                  {Math.round(event.confidence * 100)}% confidence
                </span>
              </div>
              <p className="timeline-event">{event.event}</p>
              <p className="timeline-metric">Metric affected: {event.impact}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
