const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utils/database.js');
const axios = require('axios');
const app = express();
const PORT = 3004;

app.use(bodyParser.json());

app.post('/entry', async (req, res) => {
    const { userId, parkingId } = req.body;

    // Verificar vagas disponíveis
    const parking = await db.getAsync(`SELECT availableSpaces FROM parking WHERE id = ?`, [parkingId]);
    if (parking.availableSpaces <= 0) {
        return res.status(400).json({ error: 'Nenhuma vaga disponível' });
    }

    // Atualizar vagas - service parking

    // Atualizar cŕedito do usuário

    // Registrar entrada
    db.run(`INSERT INTO access_log (userId, entryTime) VALUES (?, ?)`, [userId, new Date().toISOString()]);

    res.json({ message: 'Entry recorded' });
});

app.post('/exit', async (req, res) => {
    const { userId, parkingId } = req.body;

    // Atualizar vagas- service parking

    // Registrar saída
    db.run(`UPDATE access_log SET exitTime = ? WHERE userId = ? AND exitTime IS NULL`, [new Date().toISOString(), userId]);

    res.json({ message: 'Exit recorded and credits deducted' });
});

//Add route to get logs

app.listen(PORT, () => {
    console.log(`Access service running on port ${PORT}`);
});
