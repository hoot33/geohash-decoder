const express = require('express');
const Geohash = require('latlon-geohash');
const app = express();

// Log startup environment
console.log('Starting server with environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  PWD: process.env.PWD
});

app.use(express.json());
console.log('Express middleware configured');

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'healthy' });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint requested');
  res.json({ status: 'running' });
});

// Decode geohash endpoint
app.get('/decode/:geohash', (req, res) => {
  console.log('Decode requested for:', req.params.geohash);
  try {
    const geohash = req.params.geohash;
    
    if (!geohash || typeof geohash !== 'string' || geohash.length === 0) {
      return res.status(400).json({
        error: 'Invalid geohash provided'
      });
    }

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
console.log(`Starting server on port ${port}`);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
