const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utils/database.js');
const app = express();
const PORT = 3002;

app.use(bodyParser.json());

app.post('/add', (req, res) => {
    const { userId, amount } = req.body;
    const query = `INSERT INTO credits (userId, balance) VALUES (?, ?) ON CONFLICT(userId) DO UPDATE SET balance = balance + ?`;
    db.run(query, [userId, amount, amount], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Credits updated successfully' });
    });
});

app.get('/credits/:userId', (req, res) => {
    const query = `SELECT balance FROM credits WHERE userId = ?`;
    db.get(query, [req.params.userId], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ balance: row.balance });
    });
});

app.get('/use/:userId', (req, res) => {
    const query = `UPDATE credits SET balance = balance - 1 WHERE userId = ?`;
    db.get(query, [req.params.userId], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(200);
    });
});

app.get('/unuse/:userId', (req, res) => {
    const query = `UPDATE credits SET balance = balance + 1 WHERE userId = ?`;
    db.get(query, [req.params.userId], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(200);
    });
});

app.listen(PORT, () => {
    console.log(`Credit service running on port ${PORT}`);
});
