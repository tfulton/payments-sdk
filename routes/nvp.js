const express = require('express');
const router = express.Router();
const config = require('config');
const fetch = require('node-fetch');
const querystring = require('querystring');

var creds = config.get("env.sandbox.nvp.credentials");
var baseURL = config.get("env.sandbox.nvp.baseURL");

// do some initial prep
router.use(function(req, res, next){
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
});

router.post('/setEC', function(req, res, next) {

    const params = new URLSearchParams(baseURL);
    params.append("USER", creds.user);
    params.append("PWD", creds.pwd);
    params.append("SIGNATURE", creds.signature);
    params.append("VERSION", "204.0");
    params.append("METHOD", "SetExpressCheckout");
    params.append("RETURNURL", "https://www.paypal.com/checkoutnow/error");
    params.append("CANCELURL", "https://www.paypal.com/checkoutnow/error");
    params.append("AMT", "0.01");
    params.append("PAYMENTACTION", "Authorization");

    try {

        fetch(baseURL, {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params
        }).then(function(response){
            return response.text();
        }).then(function(body){
            console.log("Fetch BODY: ", body);
            var bodyParsed = querystring.parse(body);
            console.log("body: ", JSON.stringify(bodyParsed, null, 4));
            res.status(201).send(JSON.stringify(bodyParsed)); 
        }).catch(function (error) {
            console.log("Error: ", error);
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch(error) {

    }
});

router.get('/getEC/:token', function(req, res, next) {

    var token = req.params.token;
    console.log("TOKEN: ", token);

    const params = new URLSearchParams(baseURL);
    params.append("USER", creds.user);
    params.append("PWD", creds.pwd);
    params.append("SIGNATURE", creds.signature);
    params.append("VERSION", "204.0");
    params.append("METHOD", "GetExpressCheckoutDetails");
    params.append("TOKEN", token);

    try {

        fetch(baseURL, {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params
        }).then(function(response){
            return response.text();
        }).then(function(body){
            console.log("Fetch BODY: ", body);
            var bodyParsed = querystring.parse(body);
            console.log("body: ", JSON.stringify(bodyParsed, null, 4));
            res.status(201).send(JSON.stringify(bodyParsed)); 
        }).catch(function (error) {
            console.log("Error: ", error);
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch(error) {

    }
});

module.exports = router;