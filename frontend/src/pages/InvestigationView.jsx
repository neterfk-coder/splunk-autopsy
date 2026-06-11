import { useState } from 'react'
import { ArrowLeft, Download, AlertTriangle, CheckCircle, Clock, TrendingDown } from 'lucide-react'
import CausalGraph from '../components/dashboard/CausalGraph'
import AutopsyReport from '../components/report/AutopsyReport'
import Timeline from '../components/dashboard/Timeline'

export default function InvestigationView({ data, onBack }) {
  const [activeTab, setActiveTab] = useState('graph')
  const { causal_chain, timeline, report, queries_executed, investigation_id } = data

  const rootCause = causal_chain.find(n => n.type === 'root_cause')

  return (
    <div className="investigation">
      <header className="inv-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          New investigation
        </button>
        <div className="inv-meta">
          <span className="inv-id">#{investigation_id}</span>
          <span className="inv-queries">{queries_executed} queries executed</span>
        </div>
        <button className="download-btn" onClick={() => window.print()}>
          <Download size={14} />
          Export report
        </button>
      </header>

      {rootCause && (
        <div className="root-cause-banner">
          <AlertTriangle size={16} />
          <span>
            <strong>Root cause identified:</strong> {rootCause.description}
            <span className="confidence-badge">
              {Math.round(rootCause.confidence * 100)}% confidence
            </span>
          </span>
        </div>
      )}

      <div className="inv-stats">
        <div className="stat-card">
          <TrendingDown size={18} className="stat-icon danger" />
          <div>
            <p className="stat-label">Estimated impact</p>
            <p className="stat-value">{report.estimated_impact}</p>
          </div>
        </div>
        <div className="stat-card">
          <AlertTriangle size={18} className="stat-icon warning" />
          <div>
            <p className="stat-label">Contributing factors</p>
            <p className="stat-value">{causal_chain.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={18} className="stat-icon success" />
          <div>
            <p className="stat-label">Corrective actions</p>
            <p className="stat-value">{report.corrective_actions?.length || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={18} className="stat-icon info" />
          <div>
            <p className="stat-label">Timeline events</p>
            <p className="stat-value">{timeline.length}</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        {['graph', 'timeline', 'report'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'graph' && <CausalGraph chain={causal_chain} />}
        {activeTab === 'timeline' && <Timeline events={timeline} />}
        {activeTab === 'report' && <AutopsyReport report={report} />}
      </div>
    </div>
  )
}
