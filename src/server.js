const express = require('express');
const Geohash = require('latlon-geohash');
const app = express();

// Unhandled error logging
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

// Add request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json());

// Basic root endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Decode geohash endpoint
app.get('/decode/:geohash', (req, res) => {
    try {
        const geohash = req.params.geohash;
        console.log('Decoding geohash:', geohash);
        
        if (!geohash) {
            return res.status(400).json({ error: 'Geohash is required' });
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
        console.error('Error decoding geohash:', error);
        res.status(500).json({ error: 'Failed to decode geohash' });
    }
});

// Server startup
const port = process.env.PORT || 8080;

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
}).on('error', (error) => {
    console.error('Server startup error:', error);
    // Don't exit immediately
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
