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
    url = `http://localhost:3003/park`;
    axios({
        method: "PUT",
        url,
        data: {
            "location": parkingId
        }
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });
    // Atualizar crédito do usuário
    url = `http://localhost:3003/use/:userId'`;
    axios({
        method: "GET",
        url,
        data: {
            "userId": userId
        }
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });


    // Registrar entrada
    db.run(`INSERT INTO access_log (userId, entryTime) VALUES (?, ?)`, [userId, new Date().toISOString()]);

    res.json({ message: 'Entry recorded' });
});

app.post('/exit', async (req, res) => {
    const { userId, parkingId } = req.body;

    // Atualizar vagas- service parking
    url = `http://localhost:3003/unpark`;
    axios({
        method: "PUT",
        url,
        data: {
            "location": parkingId
        }
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });

    //Mandar cancela abrir
    url = `http://localhost:3003/gate/open`;
    axios({
        method: "POST",
        url,
        data: {}
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });


    // Registrar saída
    db.run(`UPDATE access_log SET exitTime = ? WHERE userId = ? AND exitTime IS NULL`, [new Date().toISOString(), userId]);

    res.json({ message: 'Exit recorded and credits deducted' });
});

//Add route to get logs
app.listen(PORT, () => {
    console.log(`Access service running on port ${PORT}`);
});
