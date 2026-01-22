# Google Maps Clone

A simplified clone of Google Maps built with React, Leaflet, and Node.js.

## Features
- Interactive Map (OpenStreetMap)
- Search Places (Nominatim API)
- Directions & Routing (OSRM API)
- Real-time geolocation
- Responsive Design

## Prerequisites
- Node.js (v14+)
- npm

## Setup & Run

### 1. Install Dependencies
If you haven't already:

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Run Locally

#### Frontend
Open a terminal:
```bash
cd client
npm run dev
```
The app will look for the backend but functions independently for map features.

#### Backend
Open a second terminal:
```bash
cd server
npm run dev
```
The API server will run at `http://localhost:5000`.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- Leaflet / React-Leaflet
- Express.js
