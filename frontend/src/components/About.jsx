export default function About() {
  return (
    <div>
      {/* Builder Card */}
      <div className="about-banner" style={{ marginBottom: '1.5rem' }}>
        <h2>👨‍💻 Built by Ayush Vardhan Singh</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Full Stack Weather App — built with React, Node.js, Express, and SQLite.
          Features live weather, 5-day forecast, interactive maps, CRUD operations, and multi-format data export.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="https://www.linkedin.com/in/ayush-vardhan-singh/" target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(10,102,194,0.2)', border:'1px solid rgba(10,102,194,0.4)', borderRadius:'8px', padding:'0.5rem 1rem', color:'#60a5fa', textDecoration:'none', fontSize:'0.875rem', fontWeight:500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
          <a href="https://github.com/AyushVardhanOG" target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'8px', padding:'0.5rem 1rem', color:'#e2e8f0', textDecoration:'none', fontSize:'0.875rem', fontWeight:500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </div>

      {/* PM Accelerator Card */}
      <div style={{ background:'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))', border:'1px solid rgba(96,165,250,0.2)', borderRadius:'16px', padding:'1.5rem', marginBottom:'1.5rem' }}>
        <h2 style={{ fontSize:'1.1rem', color:'var(--sky-light)', marginBottom:'0.5rem' }}>🚀 Product Manager Accelerator</h2>
        <p style={{ fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:'1.6', marginBottom:'1rem' }}>
          Product Manager Accelerator (PMA) is a leading professional development program dedicated to empowering aspiring and experienced product managers. PMA provides hands-on training, mentorship from industry experts, and real-world project experience to help individuals break into and advance in product management. Through structured cohort programs, 1-on-1 coaching, and a vibrant community, PMA has helped thousands of professionals land roles at top tech companies.
        </p>
        <a href="https://www.linkedin.com/school/product-manager-accelerator/" target="_blank" rel="noreferrer"
          style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(10,102,194,0.2)', border:'1px solid rgba(10,102,194,0.4)', borderRadius:'8px', padding:'0.5rem 1rem', color:'#60a5fa', textDecoration:'none', fontSize:'0.875rem', fontWeight:500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          Product Manager Accelerator on LinkedIn
        </a>
      </div>

      {/* Tech Stack */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-label">About This App</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          WeatherScope is a full-stack weather application demonstrating frontend and backend capabilities with real-time data, database persistence, and multi-format export.
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

      {/* Checklist */}
      <div className="card">
        <div className="section-label">Feature Checklist</div>
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