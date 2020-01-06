# payments-sdk

Project which highlights PayPal JavaScript implementations using various PayPal backend integration methods.  Integration methods include:

* Default client side orders v2
* Server side Payments v1
* Server side Orders v2
* Server side NVP
* Server side BEAM + Orders v2


## Requirements ##
* **Node.js** - Download and install node.js for your particular platform [here](https://nodejs.org/en/).  This application currently requires a recent version of Node.js (tested with **v13.3.0**) due to to the use of certain interfaces.

## Install Local ##
* Clone or download this repository to your local machine.  
You can either download a .zip and uncompress the files locally, or clone the repository using Git.  More detailed instructions can be found [here](https://github.paypal.com/NA-LE/paypal-jsv4-postman/blob/master/GitSetup.md).
* Perform ```npm install``` within the project directory.

## Configure Backend ##
* Create PayPal sandbox REST application and NVP/SOAP credentials per your particular requirements.
* Customize your credentials:
    * Local deployment:  See [./config/local.example.js](./config/local.example.json)
    * Remote deployment:  Review the [config documentation](./config/Readme.md) for your particular needs.

## Configure PP JavaScript SDK Client Library ##
Update the PP JavaScript SDK querystring with your clientId.  In the following:
   * Client Orders [here](./public/index.html#L15)
   * Payments v1 [here](./public/index_v1.html#L15)
   * Orders v2 [here](./public/index_v2.html#L15)
   * NVP [here](./public/index_nvp.html#L15)
   * BEAM [here](./public/index_ba.html#L15)

## Run ##
```npm start``` and then navigate your browser to http://localhost:3000/ (local deloyment only)

## Run on Heroku ##
See the documents at the following location for a quick Heroku setup guide:  https://github.paypal.com/NA-LE/paypal-jsv4-venmo#heroku-preparation
