const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3005;

app.use(bodyParser.json());

app.post('/open', (req, res) => {;
    setTimeout(() => {
        console.log('Cancela aberta...');
    }, 2000);

    setTimeout(() => {
        console.log('Esperando carro passar...');
    }, 2000);

    setTimeout(() => {
        console.log('Cancela fechada...');
    }, 2000);
    res.json({ message: 'Ciclo da cancela executado' });
});

app.post('/close', (req, res) => {
    console.log('Fechar cancela');
    res.json({ message: 'Cancela fechada' });
});

app.listen(PORT, () => {
    console.log(`Gate service running on port ${PORT}`);
});