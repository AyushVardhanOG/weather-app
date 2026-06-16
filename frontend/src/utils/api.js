const BASE = 'https://weather-app-backend-xskr.onrender.com/api';

// Call Open-Meteo directly from browser (avoids server rate limits)
async function geocodeDirect(q) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error(`Location "${q}" not found. Try a different city name.`);
  const r = data.results[0];
  return { name: r.name, country: r.country, lat: r.latitude, lon: r.longitude, display: `${r.name}, ${r.country}` };
}

async function weatherDirect(lat, lon) {
  const today = new Date().toISOString().split('T')[0];
  const end = new Date(); end.setDate(end.getDate() + 5);
  const endDate = end.toISOString().split('T')[0];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode` +
    `&current_weather=true&timezone=auto&start_date=${today}&end_date=${endDate}`;
  const res = await fetch(url);
  const data = await res.json();

  function wmoDesc(code) {
    const m = {0:'Clear Sky',1:'Mainly Clear',2:'Partly Cloudy',3:'Overcast',45:'Foggy',48:'Icy Fog',51:'Light Drizzle',53:'Drizzle',55:'Heavy Drizzle',61:'Light Rain',63:'Rain',65:'Heavy Rain',71:'Light Snow',73:'Snow',75:'Heavy Snow',80:'Rain Showers',81:'Showers',82:'Heavy Showers',95:'Thunderstorm',96:'Thunderstorm + Hail',99:'Thunderstorm + Heavy Hail'};
    return m[code] || 'Unknown';
  }

  const forecast = data.daily.time.map((date, i) => ({
    date, maxTemp: data.daily.temperature_2m_max[i], minTemp: data.daily.temperature_2m_min[i],
    precipitation: data.daily.precipitation_sum[i], windspeed: data.daily.windspeed_10m_max[i],
    weathercode: data.daily.weathercode[i], description: wmoDesc(data.daily.weathercode[i])
  }));

  return {
    current: { ...data.current_weather, description: wmoDesc(data.current_weather.weathercode) },
    forecast, timezone: data.timezone
  };
}

async function req(url, opts = {}) {
  const res = await fetch(BASE + url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Direct browser calls to Open-Meteo (no rate limit issues)
  geocode: (q) => geocodeDirect(q),
  geocodeCoords: async (lat, lon) => ({ lat, lon, display: `${lat.toFixed(2)}, ${lon.toFixed(2)}`, name: `${lat},${lon}` }),
  currentWeather: (lat, lon) => weatherDirect(lat, lon),

  // CRUD — goes through backend
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
  exportUrl: (format) => `${BASE}/export/${format}`,
};