const express = require('express');
const router = express.Router();
const config = require('config');
const fetch = require('node-fetch');
const buildAccessHeader = require('./authUtils').buildAccessHeader;
const querystring = require('querystring');
const urlLib = require('url');

const baseURL = config.get("env.sandbox.rest.baseURL");
const ResponseInfo = require("./dataUtils").ResponseInfo;

// do some initial prep
router.use(function (req, res, next) {
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
})
router.use(buildAccessHeader);

// create a new payment
router.post('/', function (req, res, next) {

    try {
        console.log("BODY: ", req.body);
        var body = req.body;

        const url = `${baseURL}/v1/payments/payment`;
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(body)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            // we need to parse out the EC token
            const links = json.links;
            let token = null;
            for (var link of links) {
                if (link.method === 'REDIRECT') {
                    const parsedURL = urlLib.parse(link.href, true);
                    token = parsedURL.query.token;
                }
            }
            if (token) {
                res.status(201).send(token);        
            }
            else throw new Error("Token not found in payment create");
            
        }).catch(function (error) {
            res.status(400).send(JSON.stringify(error));
        });
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send(JSON.stringify(error));
    }
});

router.get('/:paymentId', function (req, res, next) {

    try {
        const paymentId = req.params.paymentId;
        console.log('Payment ID: ', paymentId);

        const url = `${baseURL}/v1/payments/payment/${paymentId}`;
        fetch(url, {
            method: 'GET',
            headers: req.ppHeader,
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            const responseInfo = new ResponseInfo('GET', url, 'N/A', json);
            res.status(200).send(JSON.stringify(responseInfo));
        }).catch(function (error) {
            res.status(400).send(JSON.stringify(error));
        })
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send(JSON.stringify(error));
    }
});

function doExecute(req, res, next) {

    try {
        const paymentId = req.params.paymentId;
        console.log('Payment ID: ', paymentId);

        const url = `${baseURL}/v1/payments/payment/${paymentId}/execute`;
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(req.body)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            res.locals.body = json;
            next();
        }).catch(function (error) {
            throw error;
        })
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send(JSON.stringify(error));
    }
};

function doAuthorize(req, res, next){
    try {
        // get some info from the previous call to EXECUTE
        const body = res.locals.body;
        let amount = null;
        let orderId = null;

        if (body.transactions[0]
            && body.transactions[0].related_resources[0]
            && body.transactions[0].related_resources[0].order) {

            amount = body.transactions[0].amount;
            orderId = body.transactions[0].related_resources[0].order.id
        }
        else {
            res.status(400).send(JSON.stringify(new Error("Transaction or Order not found in remote.")))
        }

        const payload = {
            amount: {
                currency: amount.currency,
                total: amount.total
            }
          }

        console.log("Amount: ", amount);
        console.log("OrderId: ", orderId);

        const url = `${baseURL}/v1/payments/orders/${orderId}/authorize`;
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(payload)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log("Fetch json: ", json);
            const responseInfo = new ResponseInfo('POST', url, payload, json);
            res.locals.body = responseInfo;
            next();
        }).catch(function (error) {
            throw error;
        })
    }
    catch (error) {
        console.log("ERROR: ", error);
        res.status(500).send("ERROR: ", JSON.stringify(error));
    }
};

const combined = [doExecute, doAuthorize];
router.post('/:paymentId/doCombined', combined, function(req, res, next){
    console.log("In doCombined with paymentId: ", req.params.paymentId);
    res.status(201).send(JSON.stringify(res.locals.body));
});

// capture an authorization
router.post('/authorizations/:authorizationId/capture', function (req, res, next) {

    try {
        const authId = req.params.authorizationId;
        const url = `${baseURL}/v1/payments/authorization/${authId}/capture`;
        fetch(url, {
            method: 'POST',
            headers: req.ppHeader,
            body: JSON.stringify(req.body)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            const responseInfo = new ResponseInfo('POST', url, req.body, json);
            res.status(200).send(JSON.stringify(responseInfo));
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