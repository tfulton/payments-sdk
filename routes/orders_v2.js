const express = require('express');
const router = express.Router();
const config = require('config');
const fetch = require('node-fetch');
const buildAccessHeader = require('./authUtils').buildAccessHeader;

const baseURL = config.get("env.sandbox.rest.baseURL");
const ResponseInfo = require("./dataUtils").ResponseInfo;



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
        var body = req.body;

        const url = `${baseURL}/v2/checkout/orders`;
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(body)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            const responseInfo = new ResponseInfo('POST', url, body, json);
            console.log("ResponseInfo: ", responseInfo);
            res.status(201).send(JSON.stringify(responseInfo));
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
        const orderId = req.params.orderId;
        const url = `${baseURL}/v2/checkout/orders/${orderId}`;
        fetch(url, {
            method: 'GET',
            headers: req.ppHeader,
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            const responseInfo = new ResponseInfo('GET', url, 'N/A', json);
            console.log("ResponseInfo: ", responseInfo);
            res.status(201).send(JSON.stringify(responseInfo));
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
        const orderId = req.params.orderId;
        const url = `${baseURL}/v2/checkout/orders/${orderId}/save`;
        fetch(url, {
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
        const url = `${baseURL}/v2/checkout/orders/${orderId}/authorize`;
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: '{}'
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            const responseInfo = new ResponseInfo('POST', url, 'N/A', json);
            res.locals.body = responseInfo;
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
        const orderId = req.params.orderId;
        console.log("OrderID for capture:  ", orderId);
        
        var body = req.body;
        console.log("BODY: ", req.body);
        
        const url = `${baseURL}/v2/checkout/orders/${orderId}/capture`; 
        console.log('URL: ', url);
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(body)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            const responseInfo = new ResponseInfo('POST', url, body, json);
            res.status(201).send(JSON.stringify(responseInfo));
        }).catch(function (error) {
            res.status(400).send(JSON.stringify(new Error('Message rejected by endpoint.', error)));
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send(JSON.stringify(error));
    }
});

module.exports = router;