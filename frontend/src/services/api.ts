// Use environment variable or default to production
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://jobsabroad.onrender.com/api'

async function request(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('auth_access_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers })
  const data = await res.json().catch(() => ({}))
  
  // If data is an array, preserve it as an array (don't spread it)
  if (Array.isArray(data)) {
    return { status: res.status, ok: res.ok, results: data, data: data }
  }
  
  // For objects, spread normally but check for array-like objects
  const result = { status: res.status, ok: res.ok, ...data }
  
  // Check if the spread created an array-like object (numeric keys)
  const numericKeys = Object.keys(result).filter(key => /^\d+$/.test(key))
  if (numericKeys.length > 0 && !result.results && !result.data) {
    // Convert back to array
    const sortedKeys = numericKeys.sort((a, b) => parseInt(a) - parseInt(b))
    const arrayData = sortedKeys.map(key => result[parseInt(key) as keyof typeof result]).filter(item => item !== undefined && item !== null)
    return { status: res.status, ok: res.ok, results: arrayData, data: arrayData }
  }
  
  return result
}

export async function submitApplicationDraft(payload: any) {
  // The backend for submit-application expects the payload to be nested under an "application_data" key.
  const body = JSON.stringify({ application_data: payload })
  // This endpoint also requires authentication, so the user must be logged in.
  return request('/submit-application/', { method: 'POST', body })
}

export async function initiatePayment(payload: any) {
  return request('/initialize-payment/', { method: 'POST', body: JSON.stringify(payload) })
}

export async function confirmPaymentAndLogin(payload: any) {
  return request('/payments/confirm/', { method: 'POST', body: JSON.stringify(payload) })
}

export async function fetchUserDashboard() {
  return request('/dashboard/', { method: 'GET' })
}

export async function fetchJobSites(country?: string) {
  // Backend supports both 'country' (exact) and 'country__icontains' filters
  // When no country is provided, return all sites
  let url = '/job-sites/'
  if (country && country !== 'all') {
    // Try exact match first (case-insensitive)
    url = `/job-sites/?country=${encodeURIComponent(country)}`
  }
  
  const res = await request(url, { method: 'GET' })
  console.log('fetchJobSites raw response:', { url, country, status: res.status, ok: res.ok, keys: Object.keys(res) })
  
  // Handle paginated response from DRF ViewSet (most common format)
  if (res.results && Array.isArray(res.results)) {
    console.log('Found results array with', res.results.length, 'items')
    return { ...res, ok: true, data: res.results, status: res.status || 200 }
  }
  
  // Handle non-paginated response (direct array) - less common but possible
  if (Array.isArray(res)) {
    console.log('Response is direct array with', res.length, 'items')
    return { ok: true, data: res, results: res, status: 200 }
  }
  
  // If response has data property
  if (res.data && Array.isArray(res.data)) {
    console.log('Found data array with', res.data.length, 'items')
    return { ...res, ok: true, results: res.data, status: res.status || 200 }
  }
  
  // Handle array-like objects (numeric keys) - convert to array
  // This happens when an array is spread into an object: {...[item1, item2]} becomes {0: item1, 1: item2}
  const numericKeys = Object.keys(res).filter(key => /^\d+$/.test(key) && !['status', 'ok'].includes(key))
  if (numericKeys.length > 0 && (res.status === 200 || res.ok)) {
    // Sort numeric keys and extract values
    const sortedKeys = numericKeys.sort((a, b) => parseInt(a) - parseInt(b))
    const arrayData = sortedKeys.map(key => res[parseInt(key) as keyof typeof res]).filter(item => item !== undefined && item !== null)
    console.log('Found array-like object with', arrayData.length, 'items, converted to array')
    return { ok: true, results: arrayData, data: arrayData, status: res.status || 200 }
  }
  
  // If status is 200/ok but no recognizable data structure, log for debugging
  if (res.status === 200 || res.ok) {
    console.warn('Response is ok but no recognizable data structure:', res)
    return { ...res, ok: true, results: [], data: [] }
  }
  
  console.error('Unexpected response format:', res)
  return { ...res, ok: false, results: [], data: [] }
}

export async function fetchPopularCountries() {
  return request('/popular-countries/', { method: 'GET' })
}

export async function registerUser(payload: any) {
  // Registration doesn't require auth, so make a direct request without token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const res = await fetch(`${API_BASE}/register/`, { 
    method: 'POST', 
    body: JSON.stringify(payload),
    headers 
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, ok: res.ok, ...data }
}
