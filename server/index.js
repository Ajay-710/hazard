const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Google Maps Clone API is running');
});

// Mock/Proxy endpoints for Geocoding and Routing
// In a real app, these would call Google Maps API or OpenRoutingService
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    // Mock response for demo purposes if no API key
    res.json({
        results: [
            { name: `${q} (Demo Result)`, lat: 51.505, lng: -0.09, address: "London, UK" }, 
        ]
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
