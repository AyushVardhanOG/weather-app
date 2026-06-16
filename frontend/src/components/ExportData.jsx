import { useState } from 'react';
import { api } from '../utils/api';

const FORMATS = [
  { key: 'json', label: 'JSON', icon: '{ }', desc: 'Machine-readable structured data' },
  { key: 'csv', label: 'CSV', icon: '⊞', desc: 'Open in Excel or Google Sheets' },
  { key: 'xml', label: 'XML', icon: '</>', desc: 'Standard XML markup format' },
  { key: 'markdown', label: 'Markdown', icon: '#', desc: 'Formatted for GitHub / docs' },
  { key: 'pdf', label: 'PDF', icon: '📄', desc: 'Printable document format' },
];

export default function ExportData() {
  const [downloading, setDownloading] = useState('');

  const handleExport = async (format) => {
    setDownloading(format);
    try {
      const url = api.exportUrl(format);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather_queries.${format}`;
      a.click();
    } catch (e) {
      alert('Export failed: ' + e.message);
    } finally {
      setTimeout(() => setDownloading(''), 1000);
    }
  };

  return (
    <div>
      <div className="row">
        <h2>📤 Export Saved Data</h2>
      </div>

      <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
        ℹ️ All export formats pull from your saved query history. Make sure to save some queries first using the "Save Query" tab.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {FORMATS.map(f => (
          <div
            key={f.key}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
          >
            <div style={{ fontSize: '2rem', fontFamily: 'monospace', color: 'var(--sky-light)' }}>{f.icon}</div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{f.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f.desc}</div>
            </div>
            <button
              className="btn btn-sm"
              style={{ marginTop: 'auto' }}
              onClick={() => handleExport(f.key)}
              disabled={downloading === f.key}
            >
              {downloading === f.key ? '⏳ Downloading...' : `⬇ Download ${f.label}`}
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(37,99,235,0.05)' }}>
        <div className="section-label">Quick Download All</div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Download all formats at once:
        </p>
        <div className="export-row">
          {FORMATS.map(f => (
            <button key={f.key} className="btn btn-ghost btn-sm" onClick={() => handleExport(f.key)}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
