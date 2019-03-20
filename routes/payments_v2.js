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
})
router.use(buildAccessHeader);

// CAPTURE an order
router.post('/authorizations/:authId/capture', function(req, res, next){
    try {
        const authId = req.params.authId;

        const payload = {
            final_capture: true
        }
        const url = `${baseURL}/v2/payments/authorizations/${authId}/capture`; 
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(payload)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            const responseInfo = new ResponseInfo('POST', url, payload, json);
            res.status(201).send(responseInfo);
        }).catch(function (error) {
            res.status(400).send(JSON.stringify(error)); 
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send(JSON.stringify(error));
    }
});



module.exports = router;