const express = require('express');
const router = express.Router();
const config = require('config');
const fetch = require('node-fetch');
const querystring = require('querystring');

var creds = config.get("env.sandbox.nvp.credentials");
var baseURL = config.get("env.sandbox.nvp.baseURL");
const ResponseInfo = require("./dataUtils").ResponseInfo;

// do some initial prep
router.use(function (req, res, next) {
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
});

router.post('/setEC', function (req, res, next) {

    try {
        console.log("BODY: ", req.body);
        var cart = req.body;

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
        params.append("LOCALECODE", "en_US");
        params.append("LOGOIMG", "https://www.restorationhardware.com/assets/images/rh/favicon.ico");
        // params.append("EMAIL", cart.email);
        params.append("SOLUTIONTYPE", "Mark"); // Sole | Mark
        params.append("LANDINGPAGE", "Login"); // Billing | Login
        params.append("CHANNELTYPE", "Merchant"); // Merchant | eBayItem
        params.append("TOTALTYPE", "EstimatedTotal"); // Total | EstimatedTotal
        params.append("BRANDNAME", "Test Brand");
        params.append("PAYMENTREQUEST_0_PAYMENTREASON", "None"); // None | Refund

        // AddressType Fields
        params.append("PAYMENTREQUEST_0_SHIPTONAME", `${cart.purchase_units[0].shipping.address.name.given_name}  ${cart.purchase_units[0].shipping.address.name.surname}`);
        params.append("PAYMENTREQUEST_0_SHIPTOSTREET", cart.purchase_units[0].shipping.address.address_line_1);
        params.append("PAYMENTREQUEST_0_SHIPTOSTREET2", cart.purchase_units[0].shipping.address.address_line_2);
        params.append("PAYMENTREQUEST_0_SHIPTOCITY", cart.purchase_units[0].shipping.address.admin_area_2);
        params.append("PAYMENTREQUEST_0_SHIPTOSTATE", cart.purchase_units[0].shipping.address.admin_area_1);
        params.append("PAYMENTREQUEST_0_SHIPTOZIP", cart.purchase_units[0].shipping.address.postal_code);
        params.append("PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE", cart.purchase_units[0].shipping.address.country_code);
        params.append("PAYMENTREQUEST_0_SHIPTOPHONENUM", "415.555.1212");

        // Payment Details Type Field
        params.append("PAYMENTREQUEST_0_PAYMENTACTION", "Order"); // Sale | Authorization | Order
        params.append("PAYMENTREQUEST_0_AMT", cart.purchase_units[0].amount.value);
        params.append("PAYMENTREQUEST_0_CURRENCYCODE", cart.purchase_units[0].amount.currency_code);
        params.append("PAYMENTREQUEST_0_ITEMAMT", (function(){
            const items = cart.purchase_units[0].items;
            var total = 0;
            for (const item of items) {
                total += item.unit_amount.value * item.quantity;
            }
            return total;
        })());
        params.append("PAYMENTREQUEST_0_SHIPPINGAMT", cart.purchase_units[0].amount.breakdown.shipping.value);
        params.append("PAYMENTREQUEST_0_INSURANCEAMT", cart.purchase_units[0].amount.breakdown.insurance.value);
        params.append("PAYMENTREQUEST_0_SHIPDISCAMT", "0");
        params.append("PAYMENTREQUEST_0_INSURANCEOPTIONOFFERED", "false");
        params.append("PAYMENTREQUEST_0_HANDLINGAMT", "0");
        params.append("PAYMENTREQUEST_0_TAXAMT", cart.purchase_units[0].amount.breakdown.tax_total.value);
        params.append("PAYMENTREQUEST_0_DESC", cart.purchase_units[0].description);
        params.append("PAYMENTREQUEST_0_CUSTOM", cart.purchase_units[0].custom_id);
        params.append("PAYMENTREQUEST_0_INVNUM", cart.purchase_units[0].invoice_id);
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
        var count = 0;
        for (const item of cart.purchase_units[0].items){
            params.append("L_PAYMENTREQUEST_0_NAME" + count, item.name);
            params.append("L_PAYMENTREQUEST_0_DESC" + count, item.description);
            params.append("L_PAYMENTREQUEST_0_AMT" + count, item.unit_amount.value);
            params.append("L_PAYMENTREQUEST_0_NUMBER" + count, item.sku);
            params.append("L_PAYMENTREQUEST_0_QTY" + count, item.quantity);
            params.append("L_PAYMENTREQUEST_0_TAXAMT" + count, item.tax.value);
            params.append("L_PAYMENTREQUEST_0_ITEMURL" + count, "https://www.example.com/item");
            params.append("L_PAYMENTREQUEST_0_ITEMCATEGORY" + count, "Physical"); // Digital | Physical
        }


        // params.append("PAYMENTREQUEST_0_SELLERPAYPALACCOUNTID", "");

        // Billing Agreements
        // params.append("L_BILLINGTYPEn", "MerchantInitiatedBillingSingleAgreement"); // MerchantInitiatedBilling | MerchantInitiatedBillingSingleAgreement
        // params.append("L_BILLINGAGREEMENTDESCRIPTIONn", "");
        // params.append("L_PAYMENTTYPEn", "Any"); // Any | InstantOnly
        // params.append("L_BILLINGAGREEMENTCUSTOMn", "");

        // Tax Fields (BRAZIL ONLY)
        // params.append("TAXIDTYPE", "BR_CPF"); // BR_CPF | BR_CNPJ
        // params.append("TAXID", "");

        console.log("PARAMS: ", querystring.parse(params.toString()));
        console.log("Starting the fetch for SetExpressCheckout.");
        fetch(baseURL, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        }).then(function (response) {
            return response.text();
        }).then(function (resp) {
            console.log("Fetch RESPONSE: ", resp);
            
            var body = querystring.parse(resp);
            if (body.ACK === 'Success') 
            {
                res.status(201).send(JSON.stringify(body));
            }
            else {
                res.status(400).send(JSON.stringify(
                    new Error(`Message rejected by endpoint:  ${body.L_SHORTMESSAGE0} (${body.L_ERRORCODE0})`)));
            }
        }).catch(function (error) {
            console.log("Error: ", error);
            throw error;
        });
    }
    catch (error) {
        console.log("General Error: ", error);
        res.status(500).send(JSON.stringify({ message: "We have a problem in the fetch: " + req.originalUrl, error: error }));
    }
});

router.get('/getEC/:token', function (req, res, next) {

    try {
        const token = req.params.token;
        console.log("TOKEN: ", token);

        const params = new URLSearchParams();
        params.append("USER", creds.user);
        params.append("PWD", creds.pwd);
        params.append("SIGNATURE", creds.signature);
        params.append("VERSION", "204.0");
        params.append("METHOD", "GetExpressCheckoutDetails");
        params.append("TOKEN", token);

        // construct a request payload obj
        var reqBody = generateRequestBody(params.entries());

        console.log("Starting the fetch for GetExpressCheckoutDetails.");
        fetch(baseURL, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        }).then(function (response) {
            return response.text();
        }).then(function (resp) {
            console.log("Fetch RESPONSE: ", resp);
            var body = querystring.parse(resp);
            const responseInfo = new ResponseInfo('GET', baseURL, reqBody, body);
            if (body.ACK === 'Success') 
            {
                // res.status(201).send(JSON.stringify(body));
                res.status(201).send(JSON.stringify(responseInfo));
            }
            else {
                res.status(400).send(JSON.stringify(
                    new Error(`Message rejected by endpoint:  ${body.L_SHORTMESSAGE0} (${body.L_ERRORCODE0})`)));
            }
        }).catch(function (error) {
            console.log("Error: ", error);
            throw error;
        });
    }
    catch (error) {
        console.log("General Error: ", error);
        res.status(500).send(JSON.stringify({ message: "We have a problem in the fetch: " + req.originalUrl, error: error }));
    }
});

function doEC(req, res, next) {

    try {
        console.log("BODY: ", req.body);
        
        var cart = req.body;
        const token = cart.token;
        const payerId = cart.payerId;
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
        // params.append("BUYERMARKETINGEMAIL", "");
        // params.append("BUTTONSOURCE", "");
        // params.append("SKIPBACREATION", "true");
        // params.append("RETURNFMFDETAILS", "0");

        // AddressType Fields
        params.append("PAYMENTREQUEST_0_SHIPTONAME", cart.purchase_units[0].shipping.address.name.given_name + " " + cart.purchase_units[0].shipping.address.name.surname);
        params.append("PAYMENTREQUEST_0_SHIPTOSTREET", cart.purchase_units[0].shipping.address.address_line_1);
        params.append("PAYMENTREQUEST_0_SHIPTOSTREET2", cart.purchase_units[0].shipping.address.address_line_2);
        params.append("PAYMENTREQUEST_0_SHIPTOCITY", cart.purchase_units[0].shipping.address.admin_area_2);
        params.append("PAYMENTREQUEST_0_SHIPTOSTATE", cart.purchase_units[0].shipping.address.admin_area_1);
        params.append("PAYMENTREQUEST_0_SHIPTOZIP", cart.purchase_units[0].shipping.address.postal_code);
        params.append("PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE", cart.purchase_units[0].shipping.address.country_code);
        params.append("PAYMENTREQUEST_0_SHIPTOPHONENUM", "415.555.1212");

        // Payment Details Type Field
        params.append("PAYMENTREQUEST_0_PAYMENTACTION", "Order"); // Sale | Authorization | Order
        params.append("PAYMENTREQUEST_0_AMT", cart.purchase_units[0].amount.value);
        params.append("PAYMENTREQUEST_0_CURRENCYCODE", cart.purchase_units[0].amount.currency_code);
        params.append("PAYMENTREQUEST_0_ITEMAMT", (function(){
            const items = cart.purchase_units[0].items;
            var total = 0;
            for (const item of items) {
                total += item.unit_amount.value * item.quantity;
            }
            return total;
        })());
        params.append("PAYMENTREQUEST_0_SHIPPINGAMT", cart.purchase_units[0].amount.breakdown.shipping.value);
        params.append("PAYMENTREQUEST_0_INSURANCEAMT", cart.purchase_units[0].amount.breakdown.insurance.value);
        params.append("PAYMENTREQUEST_0_SHIPDISCAMT", "0");
        params.append("PAYMENTREQUEST_0_INSURANCEOPTIONOFFERED", "false");
        params.append("PAYMENTREQUEST_0_HANDLINGAMT", "0");
        params.append("PAYMENTREQUEST_0_TAXAMT", cart.purchase_units[0].amount.breakdown.tax_total.value);
        params.append("PAYMENTREQUEST_0_DESC", cart.purchase_units[0].description);
        params.append("PAYMENTREQUEST_0_CUSTOM", cart.purchase_units[0].custom_id);
        params.append("PAYMENTREQUEST_0_INVNUM", cart.purchase_units[0].invoice_id);
        params.append("PAYMENTREQUEST_0_NOTIFYURL", "https://www.example.com/notify");
        params.append("PAYMENTREQUEST_0_MULTISHIPPING", "0");
        params.append("PAYMENTREQUEST_0_NOTETEXT", "Note to the merchant, test.");
        params.append("NOTETOBUYER", "Note to the buyer, test.");
        // params.append("PAYMENTREQUEST_0_ALLOWEDPAYMENTMETHOD", "InstantPaymentOnly");
        // params.append("PAYMENTREQUEST_0_PAYMENTREQUESTID", "");
        // params.append("PAYMENTREQUEST_0_BUCKETCATEGORYTYPE", "");
        params.append("PAYMENTREQUEST_0_LOCATION_TYPE", "1"); // (1) Consumer; (2) Store, for BOPIS (buy online pick-up in store) transactions; (3)PickupDropoff, for PUDO (pick-up drop-off) transactions
        params.append("PAYMENTREQUEST_0_LOCATION_ID", "");

        // params.append("PAYMENTREQUEST_0_SOFTDESCRIPTOR", "TESTSTORE");
        
        // Payment Details Item Type Fields
        var count = 0;
        for (const item of cart.purchase_units[0].items){
            params.append("L_PAYMENTREQUEST_0_NAME" + count, item.name);
            params.append("L_PAYMENTREQUEST_0_DESC" + count, item.description);
            params.append("L_PAYMENTREQUEST_0_AMT" + count, item.unit_amount.value);
            params.append("L_PAYMENTREQUEST_0_NUMBER" + count, item.sku);
            params.append("L_PAYMENTREQUEST_0_QTY" + count, item.quantity);
            params.append("L_PAYMENTREQUEST_0_TAXAMT" + count, item.tax.value);
            params.append("L_PAYMENTREQUEST_0_ITEMURL" + count, "https://www.example.com/item");
            params.append("L_PAYMENTREQUEST_0_ITEMCATEGORY" + count, "Physical"); // Digital | Physical
        }

        /**
           * Did not include fields related to:
           *      - Item weight, dimensions
           *      - Ebay specific fields for items and/or sellers
           *      - Merchant discounts, loyalty or related fields
           *      - Shipping insurance and related fields
           */

        // construct a request payload obj
        var reqBody = generateRequestBody(params.entries());

        console.log("Starting the fetch for DoExpressCheckoutPayment.");
        fetch(baseURL, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        }).then(function (response) {
            return response.text();
        }).then(function (resp) {
            console.log("Fetch RESPONSE: ", resp);
            const body = querystring.parse(resp);
            const responseInfo = new ResponseInfo('POST', baseURL, reqBody, body);
            res.locals.transactionId = body.PAYMENTINFO_0_TRANSACTIONID;
            res.locals.body = responseInfo;
            next();
        }).catch(function (error) {
            console.log("Error: ", error);
            throw error;
        });
    }
    catch (error) {
        console.log("General Error: ", error);
        res.status(500).send(JSON.stringify({ message: "We have a problem in the fetch: " + req.originalUrl, error: error }));
    }
};
router.post('/doEC', doEC, function (req, res, next) {
    res.status(201).send(JSON.stringify(res.locals.body));
});

function doAuth(req, res, next) {

    try {

        var cart = req.body;

        console.log("Entering the doAuth function.");
        const transactionId = res.locals.transactionId;
        console.log("TRANSACTION ID: ", transactionId);

        const params = new URLSearchParams(baseURL);
        params.append("USER", creds.user);
        params.append("PWD", creds.pwd);
        params.append("SIGNATURE", creds.signature);
        params.append("VERSION", "204.0");
        params.append("METHOD", "DoAuthorization");
        params.append("TRANSACTIONID", transactionId);
        params.append("AMT", cart.purchase_units[0].amount.value);
        params.append("CURRENCYCODE", cart.purchase_units[0].amount.currency_code);

        // construct a request payload obj
        var reqBody = generateRequestBody(params.entries());

        console.log("Starting the fetch for DoAuthorization.");
        fetch(baseURL, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        }).then(function (response) {
            return response.text();
        }).then(function (resp) {
            console.log("Fetch RESPONSE: ", resp);
            const body = querystring.parse(resp);
            const responseInfo = new ResponseInfo('POST', baseURL, reqBody, body);
            res.locals.body = responseInfo;
            next();
        }).catch(function (error) {
            console.log("Error: ", error);
            throw error;
        });
    }
    catch (error) {
        console.log("General Error: ", error);
        res.status(500).send(JSON.stringify({ message: "We have a problem in the fetch: " + req.originalUrl, error: error }));
    }
};

router.post('/doAuth', doAuth, function (req, res, next) {
    res.status(201).send(JSON.stringify(res.locals.body));
});

const combinedDoECDoAuth = [doEC, doAuth];
router.post('/doCombined', combinedDoECDoAuth, function (req, res, next) {
    res.status(201).send(JSON.stringify(res.locals.body));
});

router.post('/doCapture', function doCapture(req, res, next) {

    try {
        console.log("Entering the doCapture function.");

        var cart = req.body;
        var transactionId = cart.transactionId;
        console.log("transactionId: ", transactionId);

        const params = new URLSearchParams(baseURL);
        params.append("USER", creds.user);
        params.append("PWD", creds.pwd);
        params.append("SIGNATURE", creds.signature);
        params.append("VERSION", "204.0");
        params.append("METHOD", "DoCapture");
        params.append("AUTHORIZATIONID", transactionId);
        params.append("AMT", cart.purchase_units[0].amount.value);
        params.append("CURRENCYCODE", cart.purchase_units[0].amount.currency_code);
        params.append("COMPLETETYPE", "Complete"); // Complete | NotComplete
        params.append("INVNUM", "INV_001");
        params.append("NOTE", "This is the final capture!");
        params.append("SOFTDESCRIPTOR", "TESTSTORE");
        // params.append("MSGSUBID", "");
        // params.append("STOREID", "");
        // params.append("TERMINALID", "");

        // construct a request payload obj
        var reqBody = generateRequestBody(params.entries());

        console.log("Starting the fetch for DoCapture.");
        fetch(baseURL, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        }).then(function (response) {
            return response.text();
        }).then(function (resp) {
            console.log("Fetch RESPONSE: ", resp);

            var body = querystring.parse(resp);
            const responseInfo = new ResponseInfo('POST', baseURL, reqBody, body);
            if (body.ACK === 'Success') {
                res.status(201).send(JSON.stringify(responseInfo));
            }
            else {
                res.status(400).send(JSON.stringify(
                    new Error(`Message rejected by endpoint:  ${body.L_SHORTMESSAGE0} (${body.L_ERRORCODE0})`)));
            }

        }).catch(function (error) {
            console.log("Error: ", error);
            throw error;
        });
    }
    catch (error) {
        console.log("General Error: ", error);
        res.status(500).send(JSON.stringify({ message: "We have a problem in the fetch: " + req.originalUrl, error: error }));
    }
});

function generateRequestBody(entries){
    var reqBody = {};
    for (const entry of entries){
        if (entry[0] === 'USER' || entry[0] === 'PWD' || entry[0] === 'SIGNATURE') {
            reqBody[entry[0]] = 'xxxxxxxxxxxx';
        }
        else {
            reqBody[entry[0]] = entry[1];
        }
    };

    return reqBody;
}

module.exports = router;