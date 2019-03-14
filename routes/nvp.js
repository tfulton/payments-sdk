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
    // params.append("TOKEN", ""); // Used for "Express Checkout second redirect flow"

    // Misc Fields
    params.append("MAXAMT", "100.00");
    params.append("RETURNURL", "https://www.paypal.com/checkoutnow/error");
    params.append("CANCELURL", "https://www.paypal.com/checkoutnow/error");
    // params.append("CALLBACK", "");
    // params.append("CALLBACKTIMEOUT", "6");
    // params.append("CALLBACKVERSION", "");
    params.append("NOSHIPPING", "0"); // 0 | 1 | 2
    params.append("ADDROVERRIDE", "0"); // 0 | 1
    params.append("NOSHIPPING", "1"); // 0 | 1
    params.append("LOCALECODE", "en_US");
    params.append("LOGOIMG", "https://www.restorationhardware.com/assets/images/rh/favicon.ico");
    params.append("EMAIL", "tofulton-buyer@paypal.com");
    params.append("SOLUTIONTYPE", "Mark"); // Sole | Mark
    params.append("LANDINGPAGE", "Login"); // Billing | Login
    params.append("CHANNELTYPE", "Merchant"); // Merchant | eBayItem
    params.append("TOTALTYPE", "EstimatedTotal"); // Total | EstimatedTotal
    params.append("BRANDNAME", "Test Brand");
    params.append("PAYMENTREQUEST_0_PAYMENTREASON", "None"); // None | Refund

    // AddressType Fields
    params.append("PAYMENTREQUEST_0_SHIPTONAME", "Scott Serverton");
    params.append("PAYMENTREQUEST_0_SHIPTOSTREET", "123 Townsend Street");
    params.append("PAYMENTREQUEST_0_SHIPTOSTREET2", "6th Floor, c/o Test1");
    params.append("PAYMENTREQUEST_0_SHIPTOCITY", "San Francisco");
    params.append("PAYMENTREQUEST_0_SHIPTOSTATE", "CA");
    params.append("PAYMENTREQUEST_0_SHIPTOZIP", "94107");
    params.append("PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE", "US");
    params.append("PAYMENTREQUEST_0_SHIPTOPHONENUM", "415.555.1212");

    // Payment Details Type Field
    params.append("PAYMENTREQUEST_0_PAYMENTACTION", "Order"); // Sale | Authorization | Order
    params.append("PAYMENTREQUEST_0_AMT", "12.00");
    params.append("PAYMENTREQUEST_0_CURRENCYCODE", "USD");
    params.append("PAYMENTREQUEST_0_ITEMAMT", "10");
    params.append("PAYMENTREQUEST_0_SHIPPINGAMT", "1");
    params.append("PAYMENTREQUEST_0_INSURANCEAMT", "0");
    params.append("PAYMENTREQUEST_0_SHIPDISCAMT", "0");
    params.append("PAYMENTREQUEST_0_INSURANCEOPTIONOFFERED", "false");
    params.append("PAYMENTREQUEST_0_HANDLINGAMT", "0");
    params.append("PAYMENTREQUEST_0_TAXAMT", "1");
    params.append("PAYMENTREQUEST_0_DESC", "New hat.");
    params.append("PAYMENTREQUEST_0_CUSTOM", "CUST_001");
    params.append("PAYMENTREQUEST_0_INVNUM", "INV_001");
    params.append("PAYMENTREQUEST_0_NOTIFYURL", "https://www.example.com/notify");
    params.append("PAYMENTREQUEST_0_MULTISHIPPING", "0");
    params.append("PAYMENTREQUEST_0_NOTETEXT", "Note to the merchant, test.");
    params.append("NOTETOBUYER", "Note to the buyer, test.");
    // params.append("PAYMENTREQUEST_0_ALLOWEDPAYMENTMETHOD", "InstantPaymentOnly");
    // params.append("PAYMENTREQUEST_0_PAYMENTREQUESTID", "");
    // params.append("PAYMENTREQUEST_0_BUCKETCATEGORYTYPE", "");
    params.append("PAYMENTREQUEST_0_LOCATION_TYPE", "1"); // (1) Consumer; (2) Store, for BOPIS (buy online pick-up in store) transactions; (3)PickupDropoff, for PUDO (pick-up drop-off) transactions
    params.append("PAYMENTREQUEST_0_LOCATION_ID", "");

    // Payment Details Item Type Fields
    params.append("L_PAYMENTREQUEST_0_NAME0", "Yellow Hat");
    params.append("L_PAYMENTREQUEST_0_DESC0", "A new yellow hat");
    params.append("L_PAYMENTREQUEST_0_AMT0", "10");
    params.append("L_PAYMENTREQUEST_0_NUMBER0", "SKU_001");
    params.append("L_PAYMENTREQUEST_0_QTY0", "1");
    params.append("L_PAYMENTREQUEST_0_TAXAMT0", "1");
    params.append("L_PAYMENTREQUEST_0_ITEMURL0", "https://www.example.com/item");
    params.append("L_PAYMENTREQUEST_0_ITEMCATEGORY0", "Physical"); // Digital | Physical

    // params.append("PAYMENTREQUEST_0_SELLERPAYPALACCOUNTID", "");

    // Billing Agreements
    // params.append("L_BILLINGTYPEn", "MerchantInitiatedBillingSingleAgreement"); // MerchantInitiatedBilling | MerchantInitiatedBillingSingleAgreement
    // params.append("L_BILLINGAGREEMENTDESCRIPTIONn", "");
    // params.append("L_PAYMENTTYPEn", "Any"); // Any | InstantOnly
    // params.append("L_BILLINGAGREEMENTCUSTOMn", "");

    // Tax Fields (BRAZIL ONLY)
    // params.append("TAXIDTYPE", "BR_CPF"); // BR_CPF | BR_CNPJ
    // params.append("TAXID", "");

    try {

        console.log("Starting the fetch for SetExpressCheckout.");
        fetch(baseURL, {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params
        }).then(function(response){
            return response.text();
        }).then(function(resp){
            console.log("Fetch RESPONSE: ", resp);
            var body = querystring.parse(resp);
            console.log("body: ", JSON.stringify(body, null, 4));
            res.status(201).send(JSON.stringify(body)); 
        }).catch(function (error) {
            console.log("Error: ", error);
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch(error) {

    }
});

router.get('/getEC/:token', function(req, res, next) {

    const token = req.params.token;
    console.log("TOKEN: ", token);

    const params = new URLSearchParams(baseURL);
    params.append("USER", creds.user);
    params.append("PWD", creds.pwd);
    params.append("SIGNATURE", creds.signature);
    params.append("VERSION", "204.0");
    params.append("METHOD", "GetExpressCheckoutDetails");
    params.append("TOKEN", token);

    try {

        console.log("Starting the fetch for GetExpressCheckoutDetails.");
        fetch(baseURL, {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params
        }).then(function(response){
            return response.text();
        }).then(function(resp){
            console.log("Fetch RESPONSE: ", resp);
            var body = querystring.parse(resp);
            console.log("body: ", JSON.stringify(body, null, 4));
            res.status(201).send(JSON.stringify(body)); 
        }).catch(function (error) {
            console.log("Error: ", error);
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch(error) {

    }
});

function doEC(req, res, next) {

    const token = req.body.token;
    const payerId = req.body.payerId;
    console.log("TOKEN: ", token);
    console.log("PAYERID: ", payerId);

    const params = new URLSearchParams(baseURL);
    params.append("USER", creds.user);
    params.append("PWD", creds.pwd);
    params.append("SIGNATURE", creds.signature);
    params.append("VERSION", "204.0");
    params.append("METHOD", "DoExpressCheckoutPayment");
    params.append("TOKEN", token);

    // Misc Fields
    params.append("PAYERID", payerId);
    // params.append("MSGSUBID", "");
    params.append("BUYERMARKETINGEMAIL", "");
    params.append("BUTTONSOURCE", "");
    params.append("SKIPBACREATION", "true");
    params.append("RETURNFMFDETAILS", "0");

    // AddressType Fields
    params.append("PAYMENTREQUEST_0_SHIPTONAME", "Scott Serverton");
    params.append("PAYMENTREQUEST_0_SHIPTOSTREET", "123 Townsend Street");
    params.append("PAYMENTREQUEST_0_SHIPTOSTREET2", "6th Floor, c/o Test1");
    params.append("PAYMENTREQUEST_0_SHIPTOCITY", "San Francisco");
    params.append("PAYMENTREQUEST_0_SHIPTOSTATE", "CA");
    params.append("PAYMENTREQUEST_0_SHIPTOZIP", "94107");
    params.append("PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE", "US");
    params.append("PAYMENTREQUEST_0_SHIPTOPHONENUM", "415.555.1212");

    // Payment Details Type Field
    params.append("PAYMENTREQUEST_0_PAYMENTACTION", "Order"); // Sale | Authorization | Order
    params.append("PAYMENTREQUEST_0_AMT", "12.00");
    params.append("PAYMENTREQUEST_0_CURRENCYCODE", "USD");
    params.append("PAYMENTREQUEST_0_ITEMAMT", "10");
    params.append("PAYMENTREQUEST_0_SHIPPINGAMT", "1");
    params.append("PAYMENTREQUEST_0_INSURANCEAMT", "0");
    params.append("PAYMENTREQUEST_0_SHIPDISCAMT", "0");
    params.append("PAYMENTREQUEST_0_INSURANCEOPTIONOFFERED", "false");
    params.append("PAYMENTREQUEST_0_HANDLINGAMT", "0");
    params.append("PAYMENTREQUEST_0_TAXAMT", "1");
    params.append("PAYMENTREQUEST_0_DESC", "New hat.");
    params.append("PAYMENTREQUEST_0_CUSTOM", "CUST_001");
    params.append("PAYMENTREQUEST_0_INVNUM", "INV_001");
    params.append("PAYMENTREQUEST_0_NOTIFYURL", "https://www.example.com/notify");
    params.append("PAYMENTREQUEST_0_MULTISHIPPING", "0");
    params.append("PAYMENTREQUEST_0_NOTETEXT", "Note to the merchant, test.");
    params.append("NOTETOBUYER", "Note to the buyer, test.");
    // params.append("PAYMENTREQUEST_0_ALLOWEDPAYMENTMETHOD", "InstantPaymentOnly");
    // params.append("PAYMENTREQUEST_0_PAYMENTREQUESTID", "");
    // params.append("PAYMENTREQUEST_0_BUCKETCATEGORYTYPE", "");
    params.append("PAYMENTREQUEST_0_LOCATION_TYPE", "1"); // (1) Consumer; (2) Store, for BOPIS (buy online pick-up in store) transactions; (3)PickupDropoff, for PUDO (pick-up drop-off) transactions
    params.append("PAYMENTREQUEST_0_LOCATION_ID", "");

    params.append("PAYMENTREQUEST_0_SOFTDESCRIPTOR", "TESTSTORE");
    
    // Payment Details Item Type Fields
    params.append("L_PAYMENTREQUEST_0_NAME0", "Yellow Hat");
    params.append("L_PAYMENTREQUEST_0_DESC0", "A new yellow hat");
    params.append("L_PAYMENTREQUEST_0_AMT0", "10");
    params.append("L_PAYMENTREQUEST_0_NUMBER0", "SKU_001");
    params.append("L_PAYMENTREQUEST_0_QTY0", "1");
    params.append("L_PAYMENTREQUEST_0_TAXAMT0", "1");
    params.append("L_PAYMENTREQUEST_0_ITEMURL0", "https://www.example.com/item");
    params.append("L_PAYMENTREQUEST_0_ITEMCATEGORY0", "Physical"); // Digital | Physical

  /**
     * Did not include fields related to:
     *      - Item weight, dimensions
     *      - Ebay specific fields for items and/or sellers
     *      - Merchant discounts, loyalty or related fields
     *      - Shipping insurance and related fields
     */

    try {

        console.log("Starting the fetch for DoExpressCheckoutPayment.");
        fetch(baseURL, {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params
        }).then(function(response){
            return response.text();
        }).then(function(resp){
            console.log("Fetch RESPONSE: ", resp);
            const body = querystring.parse(resp);
            console.log("TRANSACTION ID #1: ", body.PAYMENTINFO_0_TRANSACTIONID);
            res.locals.transactionId = body.PAYMENTINFO_0_TRANSACTIONID;
            res.locals.body = body;
            next();
        }).catch(function (error) {
            console.log("Error: ", error);
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch(error) {
        res.render('error', {message: "General error encountered", error: error});

    }
};
router.post('/doEC', doEC, function(req, res, next) {
    res.status(201).send(JSON.stringify(res.locals.body)); 
});

function doAuth(req, res, next) {

    console.log("Entering the doAuth function.");
    const transactionId = res.locals.transactionId;
    console.log("TRANSACTION ID #2: ", transactionId);

    const params = new URLSearchParams(baseURL);
    params.append("USER", creds.user);
    params.append("PWD", creds.pwd);
    params.append("SIGNATURE", creds.signature);
    params.append("VERSION", "204.0");
    params.append("METHOD", "DoAuthorization");
    params.append("TRANSACTIONID", transactionId);
    params.append("AMT", "12");
    params.append("CURRENCYCODE", "USD");

    try {

        console.log("Starting the fetch for DoAuthorization.");
        fetch(baseURL, {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params
        }).then(function(response){
            return response.text();
        }).then(function(resp){
            console.log("Fetch RESPONSE: ", resp);
            res.locals.doAuthBody = querystring.parse(resp);;
            next();
        }).catch(function (error) {
            console.log("Error: ", error);
            res.render('error', {message: "We have a problem in the fetch: " + req.originalUrl, error: error});
        });
    }
    catch(error) {
        res.render('error', {message: "General error encountered", error: error});
    }
};

router.post('/doAuth', doAuth, function(req, res, next) {
    res.status(201).send(JSON.stringify(res.locals.body));
});

const combinedDoECDoAuth = [doEC, doAuth];
router.post('/doCombined', combinedDoECDoAuth, function(req, res, next){
    res.status(201).send(JSON.stringify(res.locals.doAuthBody));
});

router.post('/doCapture', function doCapture(req, res, next) {

    console.log("Entering the doCapture function.");
    var transactionId = req.body.transactionId;
    console.log("transactionId: ", transactionId);

    const params = new URLSearchParams(baseURL);
    params.append("USER", creds.user);
    params.append("PWD", creds.pwd);
    params.append("SIGNATURE", creds.signature);
    params.append("VERSION", "204.0");
    params.append("METHOD", "DoCapture");
    params.append("AUTHORIZATIONID", transactionId);
    params.append("AMT", "12");
    params.append("CURRENCYCODE", "USD");
    params.append("COMPLETETYPE", "Complete"); // Complete | NotComplete
    params.append("INVNUM", "INV_001");
    params.append("NOTE", "This is the final capture!");
    params.append("SOFTDESCRIPTOR", "TESTSTORE");
    // params.append("MSGSUBID", "");
    // params.append("STOREID", "");
    // params.append("TERMINALID", "");

    try {

        console.log("Starting the fetch for DoCapture.");
        fetch(baseURL, {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params
        }).then(function(response){
            return response.text();
        }).then(function(resp){
            console.log("Fetch RESPONSE: ", resp);
            res.status(201).send(JSON.stringify(querystring.parse(resp)));
            
        }).catch(function (error) {
            console.log("Error: ", error);
            res.status(500).send(JSON.stringify(
                new Error("Problem in capture: ", error.message)
            ));
        });
    }
    catch(error) {
        res.render('error', {message: "General error encountered", error: error});

    }
});

module.exports = router;