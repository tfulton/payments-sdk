var express = require('express');
var router = express.Router();
var config = require('config');
var fetch = require('node-fetch');
var buildAccessHeader = require('./authUtils').buildAccessHeader;

var baseURL = config.get("env.sandbox.baseURL");


// do some initial prep
router.use(function(req, res, next){
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
})
router.use(buildAccessHeader);

// CREATE an order
router.post('/', function (req, res, next) {

    try {
        var payload = {
            "intent": "AUTHORIZE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": "4.00"
                    }
                }
            ]
        }

        fetch(`${baseURL}/v2/checkout/orders`, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(payload)
        }).then(function (response) {
            // console.log("Fetch response raw: ", response);
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            res.status(201).send(json);
        }).catch(function (error) {
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
});

// GET an order
router.get('/:orderId', function(req, res, next){

    try{
        var orderId = req.params.orderId;

        fetch(`${baseURL}/v2/checkout/orders/${orderId}`, {
            method: 'GET',
            headers: req.ppHeader,
        }).then(function (response) {
            // console.log("Fetch response raw: ", response);
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            res.status(201).send(json);
        }).catch(function (error) {
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch(error){
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
});

// AUTHORIZE an order
router.post('/:orderId/authorize', function(req, res, next){
    try {
        var orderId = req.params.orderId;

        fetch(`${baseURL}/v2/checkout/orders/${orderId}/authorize`, {
            method: 'POST',
            headers: req.ppHeader,
            body: '{}'
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            
            res.status(201).send(json.purchase_units[0].payments.authorizations[0]);
        }).catch(function (error) {
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
});

// SAVE an order
router.post('/:orderId/save', function(req, res, next){
    try {
        var orderId = req.params.orderId;

        fetch(`${baseURL}v2/checkout/orders/${orderId}/save`, {
            method: 'POST',
            headers: req.ppHeader,
            body: '{}'
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            res.status(201).send(json);
        }).catch(function (error) {
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
})

// CAPTURE an order
router.post('/capture', function(req, res, next){
    try {
        var payload = {
            "intent": "AUTHORIZE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": "4.00"
                    }
                }
            ]
        }

        fetch(`${baseURL}/v2/checkout/orders`, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(payload)
        }).then(function (response) {
            // console.log("Fetch response raw: ", response);
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            res.status(201).send(json);
        }).catch(function (error) {
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
});

module.exports = router;