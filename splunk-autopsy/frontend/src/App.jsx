import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import InvestigationView from './pages/InvestigationView'
import './styles/global.css'

export default function App() {
  const [investigation, setInvestigation] = useState(null)

  return (
    <div className="app">
      {investigation ? (
        <InvestigationView
          data={investigation}
          onBack={() => setInvestigation(null)}
        />
      ) : (
        <Dashboard onInvestigation={setInvestigation} />
      )}
    </div>
  )
}
