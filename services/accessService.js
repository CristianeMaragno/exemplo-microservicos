const express = require('express');
const bodyParser = require('body-parser');
const db = require('../utils/database.js');
const axios = require('axios');
const app = express();
const PORT = 3004;

app.use(bodyParser.json());

app.post('/entry', async (req, res) => {
    const { userId, category, location } = req.body;

    try {
        // Verificar vagas disponíveis
        const urlParking = "http://localhost:3003/parking";
        const parkingResponse = await axios.post(urlParking, { location });
        const parking = parkingResponse.data;

        if (parking.availableSpaces <= 0) {
            return res.status(400).json({ error: 'Nenhuma vaga disponível' });
        }

        let userAllowed = false;

        // Pular validação se usuário é professor ou TAE
        if (category === 'professor' || category === 'TAE') {
            userAllowed = true;
        } else {
            // Verificar se usuário tem créditos
            const urlCredit = `http://localhost:3002/credits/${userId}`;
            const creditResponse = await axios.get(urlCredit);
            const credit = creditResponse.data;

            if (credit.balance <= 0) {
                return res.status(400).json({ error: 'Usuário não tem créditos o suficiente' });
            } else {
                userAllowed = true;
            }
        }

        if (userAllowed) {
            // Atualizar vagas - service parking
            const urlUpdateParking = "http://localhost:3003/park";
            await axios.put(urlUpdateParking, { location });

            // Mandar cancela abrir
            const urlOpenGate = "http://localhost:3005/gate";
            await axios.post(urlOpenGate, {});

            // Registrar entrada
            db.run(`INSERT INTO access_log (userId, entryTime) VALUES (?, ?)`, [userId, new Date().toISOString()], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                return res.status(200).json({ message: 'Entrada efetuada com sucesso' });
            });
        }
    } catch (err) {
        return res.status(err.response?.status || 500).json({ error: err.message });
    }
});

app.post('/exit', async (req, res) => {
    const { userId, category, location } = req.body;

    try {
        // Atualizar vagas - service parking
        const urlUnpark = `http://localhost:3003/unpark`;
        await axios.put(urlUnpark, { location });

        // Mandar cancela abrir
        const urlOpenGate = "http://localhost:3005/gate";
        await axios.post(urlOpenGate, {});

        // Se não for professor ou TAE
        if (category !== 'professor' && category !== 'TAE') {
            //Atualizar crédito do usuário
            const urlUseCredit = `http://localhost:3002/use/${userId}`;
            await axios.get(urlUseCredit);
        }

        // Registrar saída
        db.run(
            `UPDATE access_log SET exitTime = ? WHERE userId = ? AND exitTime IS NULL`,
            [new Date().toISOString(), userId],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                return res.status(200).json({ message: 'Saída efetuada com sucesso' });
            }
        );
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.get('/records', async (req, res) => {
    const query = `SELECT * FROM access_log`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ records: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Access service running on port ${PORT}`);
});
