const express = require('express');
const app = express();

// Basic endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
