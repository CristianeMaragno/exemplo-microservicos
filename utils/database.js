const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cpf TEXT,
            name TEXT,
            category TEXT
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS credits (
            userId INTEGER,
            balance INTEGER,
            UNIQUE(userId),
            FOREIGN KEY(userId) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS parking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT,
            totalSpaces INTEGER,
            availableSpaces INTEGER
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS access_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            entryTime TEXT,
            exitTime TEXT,
            FOREIGN KEY(userId) REFERENCES users(id)
        )`);
    }
});

module.exports = db;