const BASE = 'http://localhost:3001/api';

async function req(url, opts = {}) {
  const res = await fetch(BASE + url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  geocode: (q) => req(`/geocode?q=${encodeURIComponent(q)}`),
  geocodeCoords: (lat, lon) => req(`/geocode?lat=${lat}&lon=${lon}`),
  currentWeather: (lat, lon) => req(`/weather/current?lat=${lat}&lon=${lon}`),

  // CRUD
  getQueries: () => req('/queries'),
  getQuery: (id) => req(`/queries/${id}`),
  createQuery: (body) => req('/queries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }),
  updateQuery: (id, body) => req(`/queries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }),
  deleteQuery: (id) => req(`/queries/${id}`, { method: 'DELETE' }),

  // Export URLs (direct download links)
  exportUrl: (format) => `${BASE}/export/${format}`,
};
