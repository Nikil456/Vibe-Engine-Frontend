const API_BASE = import.meta.env.VITE_API_BASE;

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getRestaurants() {
  const res = await fetch(`${API_BASE}/api/v1/restaurants`);
  return handleResponse(res);
}

export async function getRestaurantDetail(business_id) {
  const res = await fetch(`${API_BASE}/api/v1/restaurants/${encodeURIComponent(business_id)}`);
  return handleResponse(res);
}

export async function searchRestaurants(query, limit = 20) {
  const res = await fetch(`${API_BASE}/api/v1/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit }),
  });
  return handleResponse(res);
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}