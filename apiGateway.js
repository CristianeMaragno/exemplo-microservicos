const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;

/*
Execute services and gateway
node services/userService.js
node services/creditService.js
node services/parkingService.js
node services/accessService.js
node services/gateService.js
node apiGateway.js
*/

app.use(bodyParser.json());

const services = {
    userService: 'http://localhost:3001',
    creditService: 'http://localhost:3002',
    parkingService: 'http://localhost:3003',
    accessService: 'http://localhost:3004',
    gateService: 'http://localhost:3005'
};


app.use('/users', (req, res) => {
    const url = `${services.userService}${req.url}`;
    axios({
        method: req.method,
        url,
        data: req.body
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });
});

app.use('/credits', (req, res) => {
    const url = `${services.creditService}${req.url}`;
    axios({
        method: req.method,
        url,
        data: req.body
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });
});

app.use('/parking', (req, res) => {
    const url = `${services.parkingService}${req.url}`;
    axios({
        method: req.method,
        url,
        data: req.body
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });
});

app.use('/access', (req, res) => {
    const url = `${services.accessService}${req.url}`;
    axios({
        method: req.method,
        url,
        data: req.body
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });
});

app.use('/gate', (req, res) => {
    const url = `${services.gateService}${req.url}`;
    axios({
        method: req.method,
        url,
        data: req.body
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(err.response.status).json(err.response.data);
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
