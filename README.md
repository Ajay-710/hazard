# Google Maps Clone

A high-performance, aesthetically pleasing clone of Google Maps built with React, Tailwind CSS, Leaflet, and TypeScript.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ajay-710/hazard&root-directory=client)

## Features
- 🗺️ **Interactive Map**: Powered by OpenStreetMap & Leaflet
- 🔍 **Smart Search**: Real-time place search using Nominatim API
- 🚗 **Routing & Directions**: Turn-by-turn routing via OSRM API
- 📍 **Geolocation**: One-click "Locate Me" functionality
- 🎨 **Premium UI**: Glassmorphism, smooth transitions, and pixel-perfect design

## 🚀 Deployment

### One-Click Deployment
Click the **Deploy with Vercel** button above. It is configured to automatically set the `client` folder as the root directory.

### Manual Vercel Deployment
1. Import the repository in Vercel.
2. **Important**: In the "Root Directory" settings, click "Edit" and select `client`.
3. The framework preset should be "Vite".
4. Click **Deploy**.

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- npm

### 1. Setup
```bash
# Clone the repo
git clone https://github.com/Ajay-710/hazard.git
cd hazard

# Install Frontend Dependencies
cd client
npm install
```

### 2. Run
```bash
npm run dev
```
Open `http://localhost:5173` to view the app.

> **Note**: This application primarily uses client-side APIs (Nominatim, OSRM). The `server` folder is included as a starter for future backend extensions but is not required for the current features.
