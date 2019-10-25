require('dotenv').config();
const express = require('express'),
    path = require('path'),
    cors = require('cors'),
    bodyParser = require('body-parser');

//init
const app = express();
const APP_PORT = process.env.PORT || 3000;
const request = require('request');
const apiUrl = 'https://cors-anywhere.herokuapp.com/https://apiv2.bitcoinaverage.com/indices/global/ticker/all';

class Order {
    constructor(name, phoneNumber, gender, dob, orderDate, orderType, units, label) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.dob = dob;
        this.orderDate = orderDate;
        this.orderType = orderType;
        this.units = units;
        this.label = label;
    }
}

let orders = [];

//middleware that parses media type of application/x-www-form-urlencoded
urlencodedParser = bodyParser.urlencoded({ extended: false });
//middleware that parses media type of application/json
jsonParser = bodyParser.json();

app.use(cors());

app.post('/api/order', jsonParser, (req, res) => {
    const order = new Order(req.body.name, req.body.phoneNumber, req.body.gender, req.body.dob, req.body.orderDate,
        req.body.orderType, req.body.units, req.body.label);

    orders.push(order);
    res.status(201);
    res.json(order);
});

app.get('/api/order', (req, res) => {
    res.status(200);
    res.json({ 'orders': orders });
});

app.get('/api/order/:id', (req, res) => {
    console.log("Retrieving order details for edit...")
    res.status(200);
    const index = req.params['id'];
    res.json({ 'selectedOrder': orders[index] });
});

app.put('/api/order/:id', jsonParser, (req, res) => {
    console.log("Saving order updates...")
    const index = req.params['id'];
    const originalOrder = orders[index];

    const unitPrice = originalOrder.label / originalOrder.units;
    const newLabel = unitPrice * req.body.units;

    const orderForUpdate = new Order(req.body.name, req.body.phoneNumber, req.body.gender, req.body.dob, req.body.orderDate,
        req.body.orderType, req.body.units, newLabel);

    orders[index] = orderForUpdate;
    res.status(200);
    res.json({ 'selectedOrder': orders[index] });
});

app.get('/api/mktdata/price', (req, res) => {
    console.log("Retrieving prices...")
    const options = {
        params: {
            crypto: 'BTC',
            fiat: 'SGD'
        },
        headers: {
            'Content-Type': 'application/json',
            'X-testing': 'testing',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        }
    };
    res.status(200);
    request.get(apiUrl, options, (err, resp, body) => {
        res.send(body);
    })
});

app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});