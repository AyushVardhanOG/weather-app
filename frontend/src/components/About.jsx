export default function About() {
  return (
    <div>
      <div className="about-banner" style={{ marginBottom: '1.5rem' }}>
        <h2>🚀 Product Manager Accelerator</h2>
        <p>
          Product Manager Accelerator (PMA) is a leading professional development program dedicated to empowering aspiring and experienced product managers. PMA provides hands-on training, mentorship from industry experts, and real-world project experience to help individuals break into and advance in product management. Through structured cohort programs, 1-on-1 coaching, and a vibrant community, PMA has helped thousands of professionals land roles at top tech companies. Learn more at{' '}
          <a href="https://www.linkedin.com/school/product-manager-accelerator/" target="_blank" rel="noreferrer">
            LinkedIn → Product Manager Accelerator
          </a>
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-label">About This App</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          This weather application was built as part of the PM Accelerator AI Engineer Intern technical assessment. It demonstrates both frontend and backend (full stack) capabilities.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { title: '🌐 Frontend', items: ['React + Vite', 'Responsive design (mobile-first)', 'Leaflet/OpenStreetMap integration', '5-day forecast display', 'GPS auto-location', 'Error handling UI'] },
            { title: '⚙️ Backend', items: ['Node.js + Express REST API', 'SQLite (sql.js) database', 'Full CRUD operations', 'Date range validation', 'Location fuzzy matching', 'Multi-format export (JSON, CSV, XML, MD, PDF)'] },
            { title: '🌤 APIs Used (Free, No Key)', items: ['Open-Meteo Weather API', 'Open-Meteo Geocoding API', 'OpenStreetMap + Leaflet.js', 'Browser Geolocation API'] },
          ].map(section => (
            <div className="stat-box" key={section.title}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{section.title}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {section.items.map(item => (
                  <li key={item} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-label">Assessment Checklist</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.5rem' }}>
          {[
            ['✅', 'Location search (city, zip, GPS coords, landmarks)'],
            ['✅', 'Real-time weather from API (Open-Meteo)'],
            ['✅', '5-day forecast with icons'],
            ['✅', 'GPS / current location detection'],
            ['✅', 'Error handling (invalid location, API failure)'],
            ['✅', 'Responsive layout (mobile, tablet, desktop)'],
            ['✅', 'Interactive map (OpenStreetMap + Leaflet)'],
            ['✅', 'CRUD: Create weather queries with date ranges'],
            ['✅', 'CRUD: Read / view all saved records'],
            ['✅', 'CRUD: Update location, dates, notes'],
            ['✅', 'CRUD: Delete records with confirmation'],
            ['✅', 'Date range validation + location fuzzy match'],
            ['✅', 'Export: JSON, CSV, XML, Markdown, PDF'],
            ['✅', 'RESTful API architecture'],
            ['✅', 'SQLite database persistence'],
          ].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', alignItems: 'flex-start' }}>
              <span>{icon}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
