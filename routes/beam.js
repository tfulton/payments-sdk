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

// CREATE BA TOKEN
router.post('/createBAToken', function (req, res, next) {
    
    try {
        console.log('BODY:', req.body);
        var payload = req.body;

        const url = `${baseURL}/v1/billing-agreements/agreement-tokens`;
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(payload)
        }).then(response => {
            console.log("Fetch response raw: ", response);
            return response.json();
        }).then(json => {
            console.log("Fetch json: ", json);
            const responseInfo = new ResponseInfo('POST', url, payload, json);
            console.log("ResponseInfo: ", responseInfo);
            res.status(201).send(JSON.stringify(responseInfo));
        }).catch(function (error) {
            console.log("Fetch error: ", error);
            res.status(400).send(JSON.stringify(new Error('Message rejected by endpoint.', error)));
        });
    }
    catch (err) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }

});

router.post('/createBA/:baToken', function (req, res, next) {

    try {
        const baToken = req.params.baToken;
        console.log("BA Token:  ", baToken);

        const url = `${baseURL}/v1/billing-agreements/agreements`
        const payload = {
            token_id: baToken
        }
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(payload)
        }).then(response => {
            console.log("Fetch response raw: ", response);
            return response.json();
        }).then(json => {
            const responseInfo = new ResponseInfo('POST', url, payload, json);
            console.log("ResponseInfo: ", responseInfo);
            res.status(201).send(JSON.stringify(responseInfo));
        }).catch(function (error) {
            console.log("Fetch error: ", error);
            res.status(400).send(JSON.stringify(new Error('Message rejected by endpoint.', error)));;
        });
    }
    catch (err) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
});

router.post('/createRX', function (req, res, next) {
});

module.exports = router;