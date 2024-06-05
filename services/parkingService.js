const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utils/database.js');
const app = express();
const PORT = 3003;

app.use(bodyParser.json());

app.post('/create', (req, res) => {
    const { location, totalSpaces } = req.body;
    const query = `INSERT INTO parking (location, totalSpaces, availableSpaces) VALUES (?, ?, ?)`;
    db.run(query, [location, totalSpaces, totalSpaces], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

app.get('/parking', (req, res) => {
    const query = `SELECT * FROM parking`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ parkings: rows });
    });
});

app.post('/parking', (req, res) => {
    const { location } = req.body;
    const query = `SELECT availableSpaces FROM parking WHERE location = ?`;
    db.get(query, [location], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json({ availableSpaces: row.availableSpaces });
    });
});

app.put('/park', (req, res) => {
    const { location } = req.body;
    //validate if full here too?
    const query = `UPDATE parking  SET availableSpaces = availableSpaces + 1 WHERE location = ?`;
    db.run(query, [location], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ location: this.location });
    });
});

app.put('/unpark', (req, res) => {
    const { location } = req.body;
    const query = `UPDATE parking  SET availableSpaces = availableSpaces - 1 WHERE location = ?`;
    db.run(query, [location], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ location: this.location });
    });
});

app.listen(PORT, () => {
    console.log(`Parking service running on port ${PORT}`);
});
