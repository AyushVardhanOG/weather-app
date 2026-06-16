import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getWeatherIcon, formatDateShort } from '../utils/weather';

function EditModal({ record, onSave, onClose }) {
  const [form, setForm] = useState({
    location: record.location_name,
    dateFrom: record.date_from,
    dateTo: record.date_to,
    notes: record.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await api.updateQuery(record.id, {
        location: form.location !== record.location_name ? form.location : undefined,
        dateFrom: form.dateFrom,
        dateTo: form.dateTo,
        notes: form.notes
      });
      onSave();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">✏️ Edit Weather Query #{record.id}</div>
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
          <label className="form-label">Location</label>
          <input className="form-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">From Date</label>
            <input type="date" className="form-input" value={form.dateFrom} onChange={e => setForm(f => ({ ...f, dateFrom: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">To Date</label>
            <input type="date" className="form-input" value={form.dateTo} onChange={e => setForm(f => ({ ...f, dateTo: e.target.value }))} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
          <label className="form-label">Notes</label>
          <input className="form-input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ record, onClose }) {
  const forecast = record.weather_data?.forecast || [];
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '680px' }}>
        <div className="modal-title">🗓 Weather Data for {record.location_name}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          {record.date_from} → {record.date_to} · Saved {record.created_at}
        </div>
        {record.notes && (
          <div className="alert alert-info" style={{ marginBottom: '1rem' }}>📝 {record.notes}</div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Condition</th>
                <th>Max °C</th>
                <th>Min °C</th>
                <th>Rain mm</th>
                <th>Wind km/h</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map(d => (
                <tr key={d.date}>
                  <td>{formatDateShort(d.date)}</td>
                  <td>{getWeatherIcon(d.weathercode)} {d.description}</td>
                  <td style={{ color: 'var(--sun)' }}>{Math.round(d.maxTemp)}°</td>
                  <td style={{ color: 'var(--sky-light)' }}>{Math.round(d.minTemp)}°</td>
                  <td>{d.precipitation ?? 0}</td>
                  <td>{d.windspeed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function QueryHistory() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editRecord, setEditRecord] = useState(null);
  const [detailRecord, setDetailRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const data = await api.getQueries();
      setQueries(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueries(); }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await api.deleteQuery(id);
      setDeleteId(null);
      showSuccess('Record deleted successfully.');
      fetchQueries();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSave = () => {
    setEditRecord(null);
    showSuccess('Record updated successfully.');
    fetchQueries();
  };

  return (
    <div>
      <div className="row">
        <h2>📋 Saved Queries</h2>
        <button className="btn btn-ghost btn-sm" onClick={fetchQueries}>↻ Refresh</button>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      {loading ? (
        <div className="spinner" />
      ) : queries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
          <div style={{ color: 'var(--text-secondary)' }}>No saved queries yet. Use the "Save Query" tab to store weather data.</div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Date Range</th>
                  <th>Avg Temp</th>
                  <th>Notes</th>
                  <th>Saved</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map(q => {
                  const forecast = q.weather_data?.forecast || [];
                  const avgMax = forecast.length
                    ? (forecast.reduce((a, d) => a + d.maxTemp, 0) / forecast.length).toFixed(1)
                    : '—';
                  const topCode = forecast[0]?.weathercode;
                  return (
                    <tr key={q.id}>
                      <td><span className="badge badge-blue">#{q.id}</span></td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{getWeatherIcon(topCode)} {q.location_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {q.latitude?.toFixed(3)}, {q.longitude?.toFixed(3)}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{q.date_from}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>→ {q.date_to}</div>
                      </td>
                      <td><span className="badge badge-yellow">~{avgMax}°C</span></td>
                      <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {q.notes || '—'}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {q.created_at?.split('T')[0] || q.created_at?.split(' ')[0]}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button className="btn btn-sm btn-ghost" onClick={() => setDetailRecord(q)}>View</button>
                          <button className="btn btn-sm" onClick={() => setEditRecord(q)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(q.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-title">🗑 Confirm Delete</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Are you sure you want to delete record #{deleteId}? This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editRecord && <EditModal record={editRecord} onSave={handleEditSave} onClose={() => setEditRecord(null)} />}
      {detailRecord && <DetailModal record={detailRecord} onClose={() => setDetailRecord(null)} />}
    </div>
  );
}
