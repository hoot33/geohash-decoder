const express = require('express');
const Geohash = require('latlon-geohash');
const app = express();

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Add some startup logging
console.log('Starting server...');
console.log('Node version:', process.version);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Decode geohash endpoint
app.get('/decode/:geohash', (req, res) => {
  try {
    const geohash = req.params.geohash;
    console.log('Decoding geohash:', geohash);
    
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

// Add a root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Geohash decoder service is running',
    usage: {
      decode: 'GET /decode/:geohash',
      health: 'GET /health'
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
