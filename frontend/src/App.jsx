import { useState } from 'react';
import './index.css';
import CurrentWeather from './components/CurrentWeather';
import SaveQuery from './components/SaveQuery';
import QueryHistory from './components/QueryHistory';
import ExportData from './components/ExportData';
import About from './components/About';

const TABS = [
  { key: 'weather', label: '🌤 Live Weather' },
  { key: 'save', label: '💾 Save Query' },
  { key: 'history', label: '📋 History' },
  { key: 'export', label: '📤 Export' },
  { key: 'about', label: 'ℹ️ About' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('weather');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">⛅ WeatherScope</div>
          <div className="nav-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`nav-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => goTo(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <button style={{ display:'none', background:'none', border:'none', color:'var(--text-primary)', fontSize:'1.5rem', cursor:'pointer' }} className="nav-mobile-btn" onClick={() => setMobileMenuOpen(o => !o)}>☰</button>
        </div>
        {mobileMenuOpen && (
          <div style={{ background:'rgba(10,22,40,0.98)', borderTop:'1px solid var(--card-border)', padding:'0.5rem 1rem' }}>
            {TABS.map(t => (
              <button key={t.key} style={{ display:'block', width:'100%', textAlign:'left', padding:'0.75rem 0.5rem', background:'none', border:'none', color: activeTab===t.key ? 'var(--sky-light)' : 'var(--text-secondary)', cursor:'pointer', fontFamily:'Inter', fontSize:'0.9rem' }} onClick={() => goTo(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="main">
        <div style={{display:'none'}} className="mobile-tabs">
          <div style={{display:'flex', gap:'0.5rem', overflowX:'auto', marginBottom:'1rem', paddingBottom:'0.25rem'}}>
            {TABS.map(t => (
              <button key={t.key} className={`btn btn-sm ${activeTab===t.key ? '' : 'btn-ghost'}`} style={{whiteSpace:'nowrap', fontSize:'0.75rem'}} onClick={() => goTo(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {activeTab === 'weather' && <CurrentWeather />}
        {activeTab === 'save' && <SaveQuery onSaved={() => goTo('history')} />}
        {activeTab === 'history' && <QueryHistory />}
        {activeTab === 'export' && <ExportData />}
        {activeTab === 'about' && <About />}
      </main>

      <footer style={{ borderTop:'1px solid var(--card-border)', padding:'1.5rem 2rem', textAlign:'center', color:'var(--text-secondary)', fontSize:'0.8rem' }}>
        <strong style={{color:'var(--sky-light)'}}>WeatherScope</strong> · Built for PM Accelerator Technical Assessment ·
        Powered by <a href="https://open-meteo.com" target="_blank" rel="noreferrer" style={{color:'var(--sky-light)'}}>Open-Meteo</a> &amp; <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" style={{color:'var(--sky-light)'}}>OpenStreetMap</a>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .nav-tabs { display: none !important; }
          .nav-mobile-btn { display: block !important; }
          .mobile-tabs { display: block !important; }
        }
      `}</style>
    </div>
  );
}
