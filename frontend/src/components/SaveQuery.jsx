import { useState } from 'react';
import { api } from '../utils/api';
import { getWeatherIcon, formatDateShort, today, daysFromNow } from '../utils/weather';

export default function SaveQuery({ onSaved }) {
  const [form, setForm] = useState({
    location: '',
    dateFrom: today(),
    dateTo: daysFromNow(5),
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location.trim()) { setError('Please enter a location.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.createQuery({
        location: form.location.trim(),
        dateFrom: form.dateFrom,
        dateTo: form.dateTo,
        notes: form.notes
      });
      setResult(data);
      if (onSaved) onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="row">
        <h2>💾 Save a Weather Query</h2>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-label">Query Details</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Location *</label>
              <input
                className="form-input"
                value={form.location}
                onChange={set('location')}
                placeholder="City, zip code, landmark, or GPS coords (e.g. 51.5074,-0.1278)"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">From Date *</label>
              <input type="date" className="form-input" value={form.dateFrom} onChange={set('dateFrom')} required />
            </div>
            <div className="form-group">
              <label className="form-label">To Date *</label>
              <input type="date" className="form-input" value={form.dateTo} onChange={set('dateTo')} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Notes (optional)</label>
              <input className="form-input" value={form.notes} onChange={set('notes')} placeholder="Add context, trip name, etc." />
            </div>
          </div>

          <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
            ℹ️ Date range supports historical data (back to 1940) and forecast (up to 16 days ahead). Max 365 days per query.
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? '⏳ Fetching & Saving...' : '💾 Fetch & Save Weather Data'}
          </button>
        </form>
      </div>

      {result && (
        <div className="card">
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            ✅ Saved as Record #{result.id} — {result.location}
          </div>
          <div className="section-label">Fetched Forecast</div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Condition</th>
                  <th>Max °C</th>
                  <th>Min °C</th>
                  <th>Rain (mm)</th>
                  <th>Wind (km/h)</th>
                </tr>
              </thead>
              <tbody>
                {result.forecast.map(d => (
                  <tr key={d.date}>
                    <td>{formatDateShort(d.date)}</td>
                    <td>{getWeatherIcon(d.weathercode)} {d.description}</td>
                    <td style={{ color: 'var(--sun)', fontWeight: 600 }}>{Math.round(d.maxTemp)}°</td>
                    <td style={{ color: 'var(--sky-light)' }}>{Math.round(d.minTemp)}°</td>
                    <td>{d.precipitation ?? 0}</td>
                    <td>{d.windspeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setResult(null)}>New Query</button>
            <button className="btn btn-sm" onClick={onSaved}>View in History →</button>
          </div>
        </div>
      )}
    </div>
  );
}
