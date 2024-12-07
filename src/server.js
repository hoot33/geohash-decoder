// server.js
const express = require('express');
const Geohash = require('latlon-geohash');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Decode geohash endpoint
app.get('/decode/:geohash', (req, res) => {
  try {
    const geohash = req.params.geohash;
    
    // Basic validation
    if (!geohash || typeof geohash !== 'string' || geohash.length === 0) {
      return res.status(400).json({
        error: 'Invalid geohash provided'
      });
    }

    // Decode the geohash
    const decoded = Geohash.decode(geohash);
    
    res.json({
      coordinates: {
        lat: decoded.lat,
        lng: decoded.lon
      },
      geohash: geohash
    });
  } catch (error) {
    console.error('Decoding error:', error);
    res.status(500).json({
      error: 'Failed to decode geohash'
    });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
