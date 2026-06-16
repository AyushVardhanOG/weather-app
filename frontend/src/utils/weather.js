export function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 85) return '🌨️';
  return '⛈️';
}

export function getWeatherDesc(code) {
  const map = {
    0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Drizzle',
    55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
    80: 'Rain Showers', 81: 'Showers', 82: 'Heavy Showers',
    85: 'Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm + Hail', 99: 'Thunderstorm + Heavy Hail'
  };
  return map[code] || 'Unknown';
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getWindDirection(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function getBgGradient(code) {
  if (code === 0 || code === 1) return 'linear-gradient(160deg, #0a1628 0%, #1a3a6e 50%, #0a1628 100%)';
  if (code <= 3) return 'linear-gradient(160deg, #0a1628 0%, #1e2a45 50%, #0a1628 100%)';
  if (code <= 65) return 'linear-gradient(160deg, #0a1628 0%, #0f2340 50%, #0a1628 100%)';
  if (code <= 77) return 'linear-gradient(160deg, #0a1628 0%, #1a2840 50%, #1e3a5f 100%)';
  return 'linear-gradient(160deg, #0a1628 0%, #1a1240 50%, #0a1628 100%)';
}

export function today() {
  return new Date().toISOString().split('T')[0];
}

export function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}
