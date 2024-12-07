const express = require('express');
console.log('Loading express completed');

let Geohash;
try {
    Geohash = require('latlon-geohash');
    console.log('Loading latlon-geohash completed');
} catch (error) {
    console.error('Failed to load latlon-geohash:', error);
    process.exit(1);
}

const app = express();
console.log('Express app created');

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - Incoming ${req.method} request to ${req.url}`);
    next();
});

// Basic endpoint
app.get('/', (req, res) => {
    console.log('Root endpoint called');
    res.json({ status: 'ok' });
});

// Decode geohash endpoint
app.get('/decode/:geohash', (req, res) => {
    console.log('Decode endpoint called');
    
    try {
        const geohash = req.params.geohash;
        console.log('Received geohash:', geohash);
        
        if (!geohash) {
            console.log('No geohash provided');
            return res.status(400).json({ 
                error: 'Geohash is required',
                stage: 'validation'
            });
        }

        console.log('Attempting to decode geohash');
        const decoded = Geohash.decode(geohash);
        console.log('Successfully decoded geohash:', decoded);
        
        const response = {
            coordinates: {
                lat: decoded.lat,
                lng: decoded.lon
            },
            geohash: geohash
        };
        console.log('Sending response:', response);
        
        res.json(response);
    } catch (error) {
        console.error('Error in decode endpoint:', {
            error: error.message,
            stack: error.stack,
            stage: 'geohash_processing'
        });
        
        res.status(500).json({ 
            error: 'Failed to decode geohash',
            details: error.message,
            stage: 'geohash_processing'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        stage: 'middleware'
    });
    
    res.status(500).json({
        error: 'Internal server error',
        details: err.message,
        stage: 'middleware'
    });
});

const port = parseInt(process.env.PORT) || 8080;
console.log(`Attempting to start server on port ${port}`);

const server = app.listen(port, () => {
    console.log(`Server successfully listening on port ${port}`);
}).on('error', (error) => {
    console.error('Failed to start server:', {
        error: error.message,
        stack: error.stack,
        stage: 'startup'
    });
    process.exit(1);
});

// Process error handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', {
        error: error.message,
        stack: error.stack,
        stage: 'process'
    });
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', {
        error: error.message,
        stack: error.stack,
        stage: 'process'
    });
    process.exit(1);
});

console.log('Server setup completed');
