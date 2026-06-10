import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  timeout: 120000
})

export async function investigate(question, timeRange = 'last 7 days', index = 'main') {
  const { data } = await api.post('/api/v1/investigate', {
    question,
    time_range: timeRange,
    index
  })
  return data
}

export async function listInvestigations() {
  const { data } = await api.get('/api/v1/investigations')
  return data
}

export default api
