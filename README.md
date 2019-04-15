# payments-sdk

Project which highlights PayPal JavaScript implementations using various PayPal backends.

## Setup Instructions
1. Install packages:
    ```
    npm install
    ```

2. Customize your API credentials in the [./config/default.example.json](./config/default.example.json) configuration file.  Specfically:
   * Add your specific credentials for NVP, REST or what-have-you.
   * RENAME the file to "default.json" within the existing directory (this file will be ignored by GIT should you choose to push the contents out into the public!)

3. Start the server:
    ```
    npm start
    ```

    By default, this runs the app on port `3000`. You can configure the port by setting the environmental variable `PORT`.

NOTES:
* Currently only the Payments V1 backend has been hooked up.  Stay tuned.

## Heroku Preparation
Please see the Heroku instructions in a related repo [here](https://github.paypal.com/NA-LE/paypal-jsv4-venmo#heroku-preparation)
