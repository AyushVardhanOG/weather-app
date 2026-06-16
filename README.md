# ⛅ WeatherScope — Full Stack Weather Application

> **PM Accelerator AI Engineer Intern — Technical Assessment (Full Stack)**
> Built by: Ayush Vardhan Singh

🌐 **Live Demo:** [weather-app-iota-three-82.vercel.app](https://weather-app-iota-three-82.vercel.app)

---

## 🏢 About PM Accelerator

[Product Manager Accelerator](https://www.linkedin.com/school/product-manager-accelerator/) is a leading professional development program dedicated to empowering aspiring and experienced product managers. PMA provides hands-on training, mentorship from industry experts, and real-world project experience to help individuals break into and advance in product management. Through structured cohort programs, 1-on-1 coaching, and a vibrant alumni community, PMA has helped thousands of professionals land roles at top tech companies like Google, Meta, and Amazon.

---

## 🌤 Project Overview

**WeatherScope** is a full-stack weather application that lets users search real-time weather by city, zip code, landmark, or GPS coordinates. Users can save, manage, and export weather queries with a custom date range. Built to satisfy both **Frontend (Assessment #1)** and **Backend (Assessment #2)** requirements.

---

## ✅ Features

### 🖥 Frontend (Assessment #1)
- 🔍 Search by **city, zip code, landmark, or GPS coordinates**
- 📍 **Auto-detect current location** via browser GPS
- 🌤 **Current weather** — temperature, wind speed, wind direction
- 📅 **5-day forecast** with weather icons and min/max temps
- 🗺 **Interactive map** via OpenStreetMap + Leaflet (no API key needed)
- 💡 **Smart tips** — heat warnings, rain alerts, best travel day
- 📱 **Fully responsive** — mobile, tablet, desktop
- ⚠️ **Error handling** — invalid location, network failures, bad dates

### ⚙️ Backend (Assessment #2)
- **CREATE** — Save weather queries with location + custom date range
- **READ** — View all saved weather records
- **UPDATE** — Edit location, dates, notes with auto weather refresh
- **DELETE** — Remove records with confirmation dialog
- 📤 **Export** in 5 formats: JSON, CSV, XML, Markdown, PDF
- ✅ **Date validation** — max 16 days future, history back to 1940
- ✅ **Location validation** — fuzzy matching via geocoding
- 🗄 **SQLite database** for persistent storage
- 🔌 **RESTful API** — GET, POST, PUT, DELETE

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Custom CSS (responsive) |
| Map | Leaflet.js + OpenStreetMap |
| Backend | Node.js + Express.js |
| Database | SQLite (sql.js) |
| Weather API | Open-Meteo (free, no key) |
| Geocoding | Open-Meteo Geocoding (free, no key) |
| PDF Export | pdfkit |
| XML Export | xmlbuilder2 |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+

### Backend
```bash
cd backend
npm install
node server.js
# Running on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/geocode?q=London` | Geocode location |
| GET | `/api/weather/current?lat=&lon=` | Live weather + forecast |
| POST | `/api/queries` | Save a weather query |
| GET | `/api/queries` | Get all saved queries |
| PUT | `/api/queries/:id` | Update a query |
| DELETE | `/api/queries/:id` | Delete a query |
| GET | `/api/export/json` | Export as JSON |
| GET | `/api/export/csv` | Export as CSV |
| GET | `/api/export/xml` | Export as XML |
| GET | `/api/export/markdown` | Export as Markdown |
| GET | `/api/export/pdf` | Export as PDF |

---

## 📁 Project Structure

```
weather-app/
├── backend/
│   ├── server.js        # Express API — CRUD, weather, exports
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── CurrentWeather.jsx   # Live weather + map + forecast
│   │   │   ├── SaveQuery.jsx        # CREATE form
│   │   │   ├── QueryHistory.jsx     # READ / UPDATE / DELETE
│   │   │   ├── ExportData.jsx       # Export formats
│   │   │   └── About.jsx            # PM Accelerator info
│   │   └── utils/
│   │       ├── api.js               # API calls
│   │       └── weather.js           # Icons + helpers
│   └── package.json
└── README.md
```

---

## ✅ Assessment Checklist

- [x] Search by city, zip, GPS, landmark
- [x] Real-time weather from live API
- [x] 5-day forecast with icons
- [x] GPS auto-location
- [x] Error handling
- [x] Responsive design
- [x] Interactive map
- [x] CRUD operations with SQLite
- [x] Date + location validation
- [x] Export: JSON, CSV, XML, Markdown, PDF
- [x] RESTful API
- [x] Live deployment (Vercel + Render)
