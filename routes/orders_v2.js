var express = require('express');
var router = express.Router();
var config = require('config');
var fetch = require('node-fetch');
var buildAccessHeader = require('./authUtils').buildAccessHeader;

var baseURL = config.get("env.sandbox.rest.baseURL");


// do some initial prep
router.use(function(req, res, next){
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
});
router.use(buildAccessHeader);

// CREATE an order
router.post('/', function (req, res, next) {

    try {
        console.log("BODY: ", req.body);
        var cart = req.body;

        fetch(`${baseURL}/v2/checkout/orders`, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(cart)
        }).then(function (response) {
            // console.log("Fetch response raw: ", response);
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            res.status(201).send(json);
        }).catch(function (error) {
            res.status(400).send(JSON.stringify(new Error('Message rejected by endpoint.', error)));
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

// SAVE an order
function doSave(req, res, next){
    try {
        var orderId = req.params.orderId;

        fetch(`${baseURL}/v2/checkout/orders/${orderId}/save`, {
            method: 'POST',
            headers: req.ppHeader,
            body: '{}'
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            res.locals.body = json;
            next();
        }).catch(function (error) {
            throw error;
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
};

router.post('/:orderId/save', doSave, function(req, res, next){
    res.status(201).send(res.locals.body);
});

// AUTHORIZE an order
function doAuth(req, res, next) {
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
            res.locals.body = json;
            next();
        }).catch(function (error) {
            throw error;
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
};

router.post('/:orderId/authorize', doAuth, function(req, res, next){
    res.status(201).send(res.locals.body);
});

// COMBINED SAVE + AUTHORIZE an order
const doCombined = [doSave, doAuth];
router.post('/:orderId/doCombined', doCombined, function(req, res, next){
    res.status(201).send(JSON.stringify(res.locals.body));
});

// CAPTURE an order
router.post('/:orderId/capture', function(req, res, next){
    try {
        var orderId = req.params.orderId;

        fetch(`${baseURL}/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: req.ppHeader,
            body: '{}'
        }).then(function (response) {
            // console.log("Fetch response raw: ", response);
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            res.status(201).send(json);
        }).catch(function (error) {
            res.status(400).send(JSON.stringify(error));    
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
});

module.exports = router;