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

// CAPTURE an order
router.post('/authorizations/:authId/capture', function(req, res, next){
    try {
        var authId = req.params.authId;

        var payload = {
            final_capture: true
        }

        fetch(`${baseURL}/v2/payments/authorizations/${authId}/capture`, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(payload)
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
});



module.exports = router;