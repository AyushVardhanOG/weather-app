import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../utils/api';
import { getWeatherIcon, formatDateShort, getWindDirection, getBgGradient } from '../utils/weather';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapView({ lat, lon, label }) {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        style={{ height: '100%', width: '100%', background: '#0a1628' }}
        key={`${lat}-${lon}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[lat, lon]}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default function CurrentWeather() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const searchRef = useRef(null);

  const loadWeather = useCallback(async (lat, lon, locName) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.currentWeather(lat, lon);
      setWeather(data);
      setLocation({ lat, lon, name: locName });
      setShowMap(false);
      // small delay then show map
      setTimeout(() => setShowMap(true), 300);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Detect GPS coords
      const coordMatch = query.trim().match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);
      let geo;
      if (coordMatch) {
        geo = { lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[2]), name: `${coordMatch[1]}, ${coordMatch[2]}` };
      } else {
        geo = await api.geocode(query.trim());
      }
      await loadWeather(geo.lat, geo.lon, geo.display || geo.name);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const geo = await api.geocodeCoords(latitude, longitude);
          await loadWeather(latitude, longitude, geo.display || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        } catch (e) {
          setError(e.message);
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setError('Unable to get your location. Please allow location access or type a location.');
        setGpsLoading(false);
      }
    );
  };

  const current = weather?.current;
  const forecast = weather?.forecast || [];

  return (
    <div>
      {/* Search */}
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <div className="search-row">
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Enter city, zip code, landmark, or GPS coordinates (e.g. 40.71,-74.00)"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn" type="submit" disabled={loading || !query.trim()}>
              {loading ? '...' : '🔍 Search'}
            </button>
            <button type="button" className="gps-btn" onClick={handleGPS} disabled={gpsLoading}>
              {gpsLoading ? '...' : '📍 My Location'}
            </button>
          </div>
        </form>
        <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Try: "New York", "EC1A London", "Eiffel Tower", "48.8566,2.3522"
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {loading && !weather && <div className="spinner" />}

      {weather && location && (
        <>
          {/* Current Conditions */}
          <div className="card" style={{ marginBottom: '1.5rem', background: getBgGradient(current?.weathercode) }}>
            <div className="section-label">Current Conditions</div>
            <div className="current-weather">
              <div className="weather-hero">
                <div className="weather-location">📍 {location.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="weather-icon">{getWeatherIcon(current?.weathercode)}</div>
                  <div className="weather-temp">{Math.round(current?.temperature)}°C</div>
                </div>
                <div className="weather-desc">{current?.description}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {weather.timezone} · Updated just now
                </div>
              </div>
              <div className="weather-stats">
                <div className="stat-box">
                  <div className="stat-label">Wind Speed</div>
                  <div className="stat-value">💨 {current?.windspeed} km/h</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Wind Direction</div>
                  <div className="stat-value">🧭 {getWindDirection(current?.winddirection)} ({current?.winddirection}°)</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Latitude</div>
                  <div className="stat-value">{location.lat.toFixed(4)}°</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Longitude</div>
                  <div className="stat-value">{location.lon.toFixed(4)}°</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-label">5-Day Forecast</div>
            <div className="forecast-grid">
              {forecast.slice(0, 6).map((day, i) => (
                <div className="forecast-card" key={day.date}>
                  <div className="forecast-date">
                    {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDateShort(day.date)}
                  </div>
                  <div className="forecast-icon">{getWeatherIcon(day.weathercode)}</div>
                  <div className="forecast-desc">{day.description}</div>
                  <div className="forecast-temps">
                    <span className="temp-max">↑{Math.round(day.maxTemp)}°</span>
                    <span className="temp-min">↓{Math.round(day.minTemp)}°</span>
                  </div>
                  {day.precipitation > 0 && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--rain)', marginTop: '0.3rem' }}>
                      💧 {day.precipitation}mm
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What to Consider Tips */}
          <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <div className="section-label">💡 Things You Should Know</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {current?.windspeed > 40 && (
                <div className="stat-box"><strong>⚠️ High Winds</strong><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Winds above 40 km/h — avoid open areas and secure loose objects.</p></div>
              )}
              {forecast[0]?.precipitation > 10 && (
                <div className="stat-box"><strong>☔ Heavy Rain Expected</strong><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Over 10mm precipitation today. Bring an umbrella and waterproof gear.</p></div>
              )}
              {current?.temperature < 5 && (
                <div className="stat-box"><strong>🧥 Cold Alert</strong><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Below 5°C — dress in layers. Ice may form on roads overnight.</p></div>
              )}
              {current?.temperature > 35 && (
                <div className="stat-box"><strong>🌡️ Heat Warning</strong><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Above 35°C — stay hydrated, avoid outdoor exertion midday.</p></div>
              )}
              {[95, 96, 99].includes(current?.weathercode) && (
                <div className="stat-box"><strong>⛈️ Thunderstorm Risk</strong><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Thunderstorm conditions. Stay indoors and away from trees.</p></div>
              )}
              <div className="stat-box">
                <strong>📅 Best Travel Day</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {(() => {
                    const best = forecast.reduce((a, b) => (a.precipitation + (a.weathercode || 0)) < (b.precipitation + (b.weathercode || 0)) ? a : b);
                    return `${formatDateShort(best.date)} looks best — ${best.description}.`;
                  })()}
                </p>
              </div>
              <div className="stat-box">
                <strong>🌡️ Temperature Swing</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Today varies from {Math.round(forecast[0]?.minTemp)}°C to {Math.round(forecast[0]?.maxTemp)}°C. Dress in layers.
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="card">
            <div className="section-label">📍 Location Map — OpenStreetMap</div>
            {showMap && <MapView lat={location.lat} lon={location.lon} label={location.name} />}
          </div>
        </>
      )}

      {!weather && !loading && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
          <div style={{ color: 'var(--text-secondary)' }}>Search for any location or use your GPS to get started.</div>
        </div>
      )}
    </div>
  );
}
