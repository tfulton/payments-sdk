var config = require('config');
var base64 = require('base-64');
var fetch = require('node-fetch');

var getGrantValue = function() {
    var creds = config.get("env.sandbox.rest.credentials");
    var baseURL = config.get("env.sandbox.rest.baseURL");

    var userPass = base64.encode(creds.clientId + ":" + creds.secret);
    var headers = {
        'Authorization': 'Basic ' + userPass,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    return fetch(`${baseURL}/v1/oauth2/token`, {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials'
    }).then(function (response) {
        if (response.status === 200) {
            return response.json();
        }
        else {
            throw new Error("Error in oAuth.");
        }

    }).then(function (json) {
        return json;
    }).catch(function (error) {
        console.log("Fetch error: ", error);
        throw error;
    });
}

function createHeader(obj) {
    return {
        "Authorization": "Bearer " + obj.access_token.trim(),
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
}

var buildAccessHeader = function (req, res, next) {

    getGrantValue().then(function(results){
        req.ppHeader = createHeader(results);
        next();
    }).catch(function(error){
        res.status(403).render('error', { message: "We have a problem with Authentication!", error: error });
    });
}

module.exports = {
    getGrantValue,
    buildAccessHeader
};