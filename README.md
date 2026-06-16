# ⛅ WeatherScope — Full Stack Weather App

> **PM Accelerator AI Engineer Intern — Technical Assessment (Full Stack)**
> Completed by: [Your Name]

---

## 🌐 About PM Accelerator

[Product Manager Accelerator](https://www.linkedin.com/school/product-manager-accelerator/) is a leading professional development program dedicated to empowering aspiring and experienced product managers. PMA provides hands-on training, mentorship from industry experts, and real-world project experience to help individuals break into and advance in product management.

---

## 🚀 What This App Does

**WeatherScope** is a full-stack weather application with:

### Frontend (Assessment #1)
- 🔍 Search weather by city, zip code, landmark, or GPS coordinates
- 📍 Auto-detect current location via browser GPS
- 🌤 Live current conditions with wind, temperature, direction
- 📅 5-day forecast with weather icons
- 🗺 Interactive map (OpenStreetMap + Leaflet) — no API key needed
- ⚠️ Smart contextual tips (e.g., heat warnings, rain alerts, best travel day)
- 📱 Fully responsive — works on mobile, tablet, desktop
- ✅ Graceful error handling (invalid location, API failure)

### Backend (Assessment #2)
- **CREATE** — Save weather queries with location + date range (validated)
- **READ** — View all saved records with forecast data
- **UPDATE** — Edit location, dates, notes; auto-re-fetches weather
- **DELETE** — Delete records with confirmation
- 📤 **Export** in 5 formats: JSON, CSV, XML, Markdown, PDF
- 🗄 SQLite database persistence (sql.js — zero native deps)
- ✅ Date range validation (max 16 days future, back to 1940, max 365 days)
- ✅ Fuzzy location matching via geocoding API

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Pure CSS (responsive, custom design tokens) |
| Map | Leaflet.js + React-Leaflet + OpenStreetMap |
| Backend | Node.js + Express |
| Database | SQLite via sql.js (pure JS, zero build deps) |
| Weather API | [Open-Meteo](https://open-meteo.com/) — **free, no API key** |
| Geocoding | [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com/) — **free, no API key** |
| PDF Export | pdfkit |
| XML Export | xmlbuilder2 |

> **All APIs are 100% free with no API key required.**

---

## 📦 Installation & Running

### Prerequisites
- Node.js v18+ and npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/weather-app.git
cd weather-app
```

### 2. Install & start the backend
```bash
cd backend
npm install
node server.js
# ✅ API running on http://localhost:3001
```

### 3. Install & start the frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# ✅ App running on http://localhost:5173
```

### 4. Open the app
Go to **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
weather-app/
├── backend/
│   ├── server.js          # Express API (CRUD, export, geocoding, weather)
│   ├── weather.db         # SQLite DB (auto-created on first run)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Root component + tab navigation
│   │   ├── index.css                  # Global styles
│   │   ├── components/
│   │   │   ├── CurrentWeather.jsx     # Live weather + map + forecast
│   │   │   ├── SaveQuery.jsx          # CREATE form
│   │   │   ├── QueryHistory.jsx       # READ / UPDATE / DELETE table
│   │   │   ├── ExportData.jsx         # Export all formats
│   │   │   └── About.jsx              # PM Accelerator info + checklist
│   │   └── utils/
│   │       ├── api.js                 # API service layer
│   │       └── weather.js             # Icons, formatters, helpers
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/geocode?q=London` | Geocode a location name |
| GET | `/api/geocode?lat=51.5&lon=-0.1` | Reverse geocode |
| GET | `/api/weather/current?lat=&lon=` | Live weather + 5-day forecast |
| **POST** | `/api/queries` | **CREATE** — save a weather query |
| **GET** | `/api/queries` | **READ** — all saved queries |
| **GET** | `/api/queries/:id` | **READ** — single query |
| **PUT** | `/api/queries/:id` | **UPDATE** — edit query |
| **DELETE** | `/api/queries/:id` | **DELETE** — remove query |
| GET | `/api/export/json` | Export as JSON |
| GET | `/api/export/csv` | Export as CSV |
| GET | `/api/export/xml` | Export as XML |
| GET | `/api/export/markdown` | Export as Markdown |
| GET | `/api/export/pdf` | Export as PDF |

---

## ✅ Assessment Checklist

- [x] Location input: city, zip, GPS coords, landmark
- [x] Real-time weather (Open-Meteo, no API key)
- [x] 5-day forecast with icons
- [x] Current GPS location detection
- [x] Error handling (invalid location, network failure, bad dates)
- [x] Responsive design (mobile + tablet + desktop)
- [x] Interactive map (OpenStreetMap)
- [x] CRUD: Create weather queries with date ranges
- [x] CRUD: Read all saved records
- [x] CRUD: Update location / dates / notes
- [x] CRUD: Delete with confirmation
- [x] Date range validation
- [x] Location fuzzy matching via geocoding
- [x] Export: JSON, CSV, XML, Markdown, PDF
- [x] RESTful API design
- [x] SQLite database persistence
- [x] PM Accelerator info included
