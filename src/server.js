// Server using ES Modules
import express from 'express';
import Geohash from 'latlon-geohash';

console.error('Starting server...');

const app = express();

// Basic endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

// Decode endpoint
app.get('/decode/:geohash', (req, res) => {
    try {
        const geohash = req.params.geohash;
        const decoded = Geohash.decode(geohash);
        
        res.json({
            coordinates: {
                lat: decoded.lat,
                lng: decoded.lon
            },
            geohash: geohash
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, '0.0.0.0', () => {
    console.error(`Server running on ${port}`);
});
