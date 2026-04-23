const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    const detail = payload?.detail || payload?.message || `Request failed (${response.status})`
    throw new Error(detail)
  }

  return payload
}

export async function fetchRestaurants() {
  const payload = await request('/v1/restaurants')
  return Array.isArray(payload?.restaurants) ? payload.restaurants : []
}

export async function searchRestaurants(query, limit = 40) {
  const payload = await request('/v1/search', {
    method: 'POST',
    body: JSON.stringify({ query, limit }),
  })

  return Array.isArray(payload?.results) ? payload.results : []
}

export async function fetchRestaurantDetails(businessId) {
  if (!businessId) {
    throw new Error('businessId is required')
  }

  return request(`/v1/restaurants/${encodeURIComponent(businessId)}`)
}
