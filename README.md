# AETHER INTEL — Precision Weather OS

A modern, responsive **Weather Intelligence Application** built with React 19, TypeScript, Tailwind CSS, and Vite. Powered by the free and open [Open-Meteo API](https://open-meteo.com/).

---

## 🌟 Highlights & Features

- **Live City Geocoding & Search**: Search any city worldwide with real-time debounced auto-complete suggestions and search history.
- **Hero Current Weather**: Displays live temperature, feels-like, wind speed & compass direction, humidity, UV index, and high/low ranges.
- **Smart Planning Recommendations**: Actionable dress code, gear, and safety suggestions generated dynamically based on weather parameters (rain gear, high wind caution, heat hydration, layering).
- **7-Day Forecast Grid**: Compact daily breakdown showing weather conditions, min/max temperatures, and total precipitation (mm).
- **Interactive Visual Charts**: Built with `recharts` to render 7-day temperature trends, daily precipitation sums, and 24-hour intraday curves for selected days.
- **Units Customization**: Instant toggle between Celsius (°C) / Fahrenheit (°F) and km/h / mph.
- **Immersive Dark Atmospheric UI**: Designed with glassmorphism cards, vibrant status accents, and ambient background glows.
- **Cloudflare Pages SPA Support**: Includes `public/_redirects` for seamless single-page application routing.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **Weather Telemetry API**: Open-Meteo Geocoding & Forecast APIs

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 API Endpoints Used

- **Geocoding Search**: `https://geocoding-api.open-meteo.com/v1/search?name={cityName}`
- **Forecast & Current Weather**: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m,uv_index&timezone=auto`
