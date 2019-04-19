# payments-sdk

Project which highlights PayPal JavaScript implementations using various PayPal backend integration methods.  Integration methods include:

* Default client side orders v2
* Server side Payments v1
* Server side Orders v2
* Server side NVP
* Server side BEAM + Orders v2

## Setup Instructions
1. Install packages:
    ```
    npm install
    ```
2. Update the PP JavaScript SDK querystring with your clientId.  Here:
   * Client Orders [here](./public/index.html#L15
   * Payments v1 [here](./public/index_v1.html#L15
   * Orders v2 [here](./public/index_v2.html#L15
   * NVP [here](./public/index_nvp.html#L15
   * BEAM [here](./public/index_ba.html#L15)

3. Customize your API credentials in the [./config/default.example.json](./config/default.example.json) configuration file.  Specfically:
   * Add your specific credentials for NVP, REST or what-have-you.
   * RENAME the file to "default.json" within the existing directory (this file will be ignored by GIT should you choose to push the contents out into the public!)

4. Start the server:
    ```
    npm start
    ```

    By default, this runs the app on port `3000`. You can configure the port by setting the environmental variable `PORT`.

NOTES:
* Currently only the Payments V1 backend has been hooked up.  Stay tuned.

## Heroku Preparation
Please see the Heroku instructions in a related repo [here](https://github.paypal.com/NA-LE/paypal-jsv4-venmo#heroku-preparation)
