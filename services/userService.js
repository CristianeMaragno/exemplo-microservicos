const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utils/database.js');
const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.post('/create', (req, res) => {
    const { cpf, name, category } = req.body;
    console.log(name);
    const query = `INSERT INTO users (cpf, name, category) VALUES (?, ?, ?)`;
    db.run(query, [cpf, name, category], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

app.put('/update', (req, res) => {
    const { id, cpf, name, category } = req.body;
    const query = `UPDATE users SET cpf = ?, name = ?, category = ? WHERE id = ?`;
    db.run(query, [cpf, name, category, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: id });
    });
});

app.get('/list', (req, res) => {
    const query = `SELECT * FROM users`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});

app.get('/user', (req, res) => {
    const { id } = req.body;
    const query = `SELECT * FROM users where id = ?`;
    db.all(query, [id], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});

app.delete('/delete', (req, res) => {
    const { id } = req.body;
    const query = `DELETE FROM users where id = ?`;
    db.all(query, [id], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
