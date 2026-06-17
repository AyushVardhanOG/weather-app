const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { create } = require('xmlbuilder2');
const PDFDocument = require('pdfkit');
const initSqlJs = require('sql.js');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Database Setup ────────────────────────────────────────────────────────────
const DB_FILE = path.join(__dirname, 'weather.db');
let db;

async function initDB() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`CREATE TABLE IF NOT EXISTS weather_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    date_from TEXT NOT NULL,
    date_to TEXT NOT NULL,
    weather_data TEXT NOT NULL,
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  saveDB();
  console.log('✅ Database ready');
}

function saveDB() {
  const data = db.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

// ─── Retry helper for rate-limited requests ────────────────────────────────────
async function fetchWithRetry(url, retries = 3, delayMs = 1500) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await axios.get(url);
    } catch (err) {
      const status = err.response?.status;
      const isLastAttempt = attempt === retries;
      if (status === 429 && !isLastAttempt) {
        await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}

// ─── Geocoding ─────────────────────────────────────────────────────────────────
async function geocode(location) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  let res;
  try {
    res = await fetchWithRetry(url);
  } catch (err) {
    if (err.response?.status === 429) {
      throw new Error('Weather service is busy right now. Please wait a few seconds and try again.');
    }
    throw err;
  }
  if (!res.data.results || res.data.results.length === 0) {
    throw new Error(`Location "${location}" not found`);
  }
  const r = res.data.results[0];
  return { name: r.name, country: r.country, lat: r.latitude, lon: r.longitude, display: `${r.name}, ${r.country}` };
}

async function geocodeCoords(lat, lon) {
  // Reverse geocode using open-meteo elevation (just return coords)
  return { name: `${lat},${lon}`, country: '', lat, lon, display: `Lat: ${lat}, Lon: ${lon}` };
}

// ─── Weather Fetcher ───────────────────────────────────────────────────────────
async function fetchWeather(lat, lon, dateFrom, dateTo) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode` +
    `&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode` +
    `&current_weather=true` +
    `&timezone=auto&start_date=${dateFrom}&end_date=${dateTo}`;
  try {
    const res = await fetchWithRetry(url);
    return res.data;
  } catch (err) {
    if (err.response?.status === 429) {
      throw new Error('Weather service is busy right now. Please wait a few seconds and try again.');
    }
    throw err;
  }
}

function wmoDescription(code) {
  const codes = {
    0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
    55: 'Dense Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 80: 'Rain Showers',
    81: 'Moderate Showers', 82: 'Violent Showers', 85: 'Snow Showers', 95: 'Thunderstorm',
    96: 'Thunderstorm w/ Hail', 99: 'Thunderstorm w/ Heavy Hail'
  };
  return codes[code] || 'Unknown';
}

function validateDateRange(dateFrom, dateTo) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  const today = new Date();
  const maxFuture = new Date();
  maxFuture.setDate(today.getDate() + 16);
  const minPast = new Date('1940-01-01');

  if (isNaN(from) || isNaN(to)) throw new Error('Invalid date format. Use YYYY-MM-DD');
  if (from > to) throw new Error('Start date must be before end date');
  if (to > maxFuture) throw new Error('End date cannot be more than 16 days in the future');
  if (from < minPast) throw new Error('Start date cannot be before 1940-01-01');
  const diffDays = (to - from) / (1000 * 60 * 60 * 24);
  if (diffDays > 365) throw new Error('Date range cannot exceed 365 days');
}

// ─── Routes ────────────────────────────────────────────────────────────────────

// Geocode search
app.get('/api/geocode', async (req, res) => {
  try {
    const { q, lat, lon } = req.query;
    let result;
    if (lat && lon) {
      result = await geocodeCoords(parseFloat(lat), parseFloat(lon));
    } else if (q) {
      result = await geocode(q);
    } else {
      return res.status(400).json({ error: 'Provide q or lat/lon' });
    }
    res.json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// Current + 5-day forecast (no DB storage)
app.get('/api/weather/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

    const today = new Date().toISOString().split('T')[0];
    const end = new Date();
    end.setDate(end.getDate() + 5);
    const endDate = end.toISOString().split('T')[0];

    const data = await fetchWeather(parseFloat(lat), parseFloat(lon), today, endDate);

    const forecast = data.daily.time.map((date, i) => ({
      date,
      maxTemp: data.daily.temperature_2m_max[i],
      minTemp: data.daily.temperature_2m_min[i],
      precipitation: data.daily.precipitation_sum[i],
      windspeed: data.daily.windspeed_10m_max[i],
      weathercode: data.daily.weathercode[i],
      description: wmoDescription(data.daily.weathercode[i])
    }));

    res.json({
      current: {
        ...data.current_weather,
        description: wmoDescription(data.current_weather.weathercode)
      },
      forecast,
      timezone: data.timezone
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE - Store a query with date range
app.post('/api/queries', async (req, res) => {
  try {
    const { location, dateFrom, dateTo, notes, lat: providedLat, lon: providedLon, displayName } = req.body;
    if (!location || !dateFrom || !dateTo) {
      return res.status(400).json({ error: 'location, dateFrom, dateTo are required' });
    }

    validateDateRange(dateFrom, dateTo);

    let geo;
    if (providedLat !== undefined && providedLon !== undefined) {
      // Browser already geocoded this — skip server-side geocoding entirely
      geo = { lat: parseFloat(providedLat), lon: parseFloat(providedLon), display: displayName || location };
    } else {
      // Fallback: server geocodes (used if browser geocoding wasn't possible)
      const coordsMatch = location.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      if (coordsMatch) {
        geo = await geocodeCoords(parseFloat(coordsMatch[1]), parseFloat(coordsMatch[2]));
      } else {
        geo = await geocode(location);
      }
    }

    let forecast, timezone;
    if (req.body.forecast && Array.isArray(req.body.forecast)) {
      // Browser already fetched weather data — skip server-side weather API call entirely
      forecast = req.body.forecast;
      timezone = req.body.timezone || 'UTC';
    } else {
      // Fallback: server fetches weather itself
      const weatherData = await fetchWeather(geo.lat, geo.lon, dateFrom, dateTo);
      forecast = weatherData.daily.time.map((date, i) => ({
        date,
        maxTemp: weatherData.daily.temperature_2m_max[i],
        minTemp: weatherData.daily.temperature_2m_min[i],
        precipitation: weatherData.daily.precipitation_sum[i],
        windspeed: weatherData.daily.windspeed_10m_max[i],
        weathercode: weatherData.daily.weathercode[i],
        description: wmoDescription(weatherData.daily.weathercode[i])
      }));
      timezone = weatherData.timezone;
    }

    const stored = JSON.stringify({ forecast, timezone });

    db.run(
      `INSERT INTO weather_queries (location_name, latitude, longitude, date_from, date_to, weather_data, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [geo.display, geo.lat, geo.lon, dateFrom, dateTo, stored, notes || '']
    );
    saveDB();

    const idRes = db.exec('SELECT last_insert_rowid() as id');
    const newId = idRes[0].values[0][0];

    res.status(201).json({
      id: newId,
      location: geo.display,
      latitude: geo.lat,
      longitude: geo.lon,
      dateFrom,
      dateTo,
      notes: notes || '',
      forecast
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// READ - Get all queries
app.get('/api/queries', (req, res) => {
  try {
    const result = db.exec(
      `SELECT id, location_name, latitude, longitude, date_from, date_to, weather_data, notes, created_at, updated_at
       FROM weather_queries ORDER BY created_at DESC`
    );
    if (!result.length) return res.json([]);

    const cols = result[0].columns;
    const rows = result[0].values.map(row => {
      const obj = {};
      cols.forEach((c, i) => { obj[c] = row[i]; });
      obj.weather_data = JSON.parse(obj.weather_data);
      return obj;
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ - Get single query
app.get('/api/queries/:id', (req, res) => {
  try {
    const result = db.exec(
      `SELECT * FROM weather_queries WHERE id = ${parseInt(req.params.id)}`
    );
    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ error: 'Query not found' });
    }
    const cols = result[0].columns;
    const obj = {};
    cols.forEach((c, i) => { obj[c] = result[0].values[0][i]; });
    obj.weather_data = JSON.parse(obj.weather_data);
    res.json(obj);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE - update notes or re-fetch weather
app.put('/api/queries/:id', async (req, res) => {
  try {
    const { notes, dateFrom, dateTo, location, lat: providedLat, lon: providedLon, displayName, forecast: providedForecast, timezone: providedTz } = req.body;
    const id = parseInt(req.params.id);

    const existing = db.exec(`SELECT * FROM weather_queries WHERE id = ${id}`);
    if (!existing.length || !existing[0].values.length) {
      return res.status(404).json({ error: 'Query not found' });
    }
    const cols = existing[0].columns;
    const row = {};
    cols.forEach((c, i) => { row[c] = existing[0].values[0][i]; });

    let newDateFrom = dateFrom || row.date_from;
    let newDateTo = dateTo || row.date_to;
    let newNotes = notes !== undefined ? notes : row.notes;
    let lat = row.latitude;
    let lon = row.longitude;
    let locationName = row.location_name;

    validateDateRange(newDateFrom, newDateTo);

    if (providedLat !== undefined && providedLon !== undefined) {
      // Browser already geocoded this — skip server-side geocoding
      lat = parseFloat(providedLat);
      lon = parseFloat(providedLon);
      locationName = displayName || location;
    } else if (location) {
      const geo = await geocode(location);
      lat = geo.lat;
      lon = geo.lon;
      locationName = geo.display;
    }

    let forecast, timezone;
    if (providedForecast && Array.isArray(providedForecast)) {
      // Browser already fetched weather — skip server-side weather API call
      forecast = providedForecast;
      timezone = providedTz || 'UTC';
    } else {
      const weatherData = await fetchWeather(lat, lon, newDateFrom, newDateTo);
      forecast = weatherData.daily.time.map((date, i) => ({
        date,
        maxTemp: weatherData.daily.temperature_2m_max[i],
        minTemp: weatherData.daily.temperature_2m_min[i],
        precipitation: weatherData.daily.precipitation_sum[i],
        windspeed: weatherData.daily.windspeed_10m_max[i],
        weathercode: weatherData.daily.weathercode[i],
        description: wmoDescription(weatherData.daily.weathercode[i])
      }));
      timezone = weatherData.timezone;
    }

    const stored = JSON.stringify({ forecast, timezone });

    db.run(
      `UPDATE weather_queries SET location_name=?, latitude=?, longitude=?, date_from=?, date_to=?, weather_data=?, notes=?, updated_at=datetime('now') WHERE id=?`,
      [locationName, lat, lon, newDateFrom, newDateTo, stored, newNotes, id]
    );
    saveDB();

    res.json({ id, location: locationName, latitude: lat, longitude: lon, dateFrom: newDateFrom, dateTo: newDateTo, notes: newNotes, forecast });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE
app.delete('/api/queries/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.exec(`SELECT id FROM weather_queries WHERE id = ${id}`);
    if (!existing.length || !existing[0].values.length) {
      return res.status(404).json({ error: 'Query not found' });
    }
    db.run(`DELETE FROM weather_queries WHERE id = ?`, [id]);
    saveDB();
    res.json({ message: `Record ${id} deleted successfully` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Export Endpoints ──────────────────────────────────────────────────────────
function getAllRows() {
  const result = db.exec(
    `SELECT id, location_name, latitude, longitude, date_from, date_to, notes, created_at FROM weather_queries ORDER BY created_at DESC`
  );
  if (!result.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    cols.forEach((c, i) => { obj[c] = row[i]; });
    return obj;
  });
}

// Export JSON
app.get('/api/export/json', (req, res) => {
  const rows = getAllRows();
  res.setHeader('Content-Disposition', 'attachment; filename="weather_queries.json"');
  res.setHeader('Content-Type', 'application/json');
  res.json(rows);
});

// Export CSV
app.get('/api/export/csv', (req, res) => {
  const rows = getAllRows();
  const headers = ['id', 'location_name', 'latitude', 'longitude', 'date_from', 'date_to', 'notes', 'created_at'];
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  res.setHeader('Content-Disposition', 'attachment; filename="weather_queries.csv"');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

// Export XML
app.get('/api/export/xml', (req, res) => {
  const rows = getAllRows();
  const root = create({ version: '1.0' }).ele('WeatherQueries');
  rows.forEach(r => {
    const q = root.ele('Query');
    Object.entries(r).forEach(([k, v]) => q.ele(k).txt(String(v || '')));
  });
  res.setHeader('Content-Disposition', 'attachment; filename="weather_queries.xml"');
  res.setHeader('Content-Type', 'application/xml');
  res.send(root.end({ prettyPrint: true }));
});

// Export Markdown
app.get('/api/export/markdown', (req, res) => {
  const rows = getAllRows();
  let md = '# Weather Query History\n\n';
  md += '| ID | Location | Lat | Lon | From | To | Notes | Created |\n';
  md += '|----|----------|-----|-----|------|----|-------|---------|\n';
  rows.forEach(r => {
    md += `| ${r.id} | ${r.location_name} | ${r.latitude} | ${r.longitude} | ${r.date_from} | ${r.date_to} | ${r.notes || '-'} | ${r.created_at} |\n`;
  });
  res.setHeader('Content-Disposition', 'attachment; filename="weather_queries.md"');
  res.setHeader('Content-Type', 'text/markdown');
  res.send(md);
});

// Export PDF
app.get('/api/export/pdf', (req, res) => {
  const rows = getAllRows();
  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
  res.setHeader('Content-Disposition', 'attachment; filename="weather_queries.pdf"');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Weather Query History', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10);

  rows.forEach((r, i) => {
    if (i > 0) doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text(`#${r.id} — ${r.location_name}`)
      .font('Helvetica')
      .text(`Dates: ${r.date_from} to ${r.date_to}  |  Coords: ${r.latitude}, ${r.longitude}`)
      .text(`Notes: ${r.notes || 'None'}  |  Created: ${r.created_at}`);
    doc.moveTo(30, doc.y + 4).lineTo(doc.page.width - 30, doc.y + 4).stroke();
  });

  doc.end();
});

// ─── OpenStreetMap tiles proxy hint ────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Start ─────────────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(3001, () => console.log('🌤  Weather API running on http://localhost:3001'));
});