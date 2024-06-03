const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3005;

app.use(bodyParser.json());

app.post('/gate/open', (req, res) => {
    console.log('Cancela aberta');
    res.json({ message: 'Cancela aberta' });
});

app.post('/gate/close', (req, res) => {
    console.log('Cancela fechada');
    res.json({ message: 'Cancela fechada' });
});

app.listen(PORT, () => {
    console.log(`Gate service running on port ${PORT}`);
});