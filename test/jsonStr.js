const paymentData = {
    "description": "Billing Agreement",
    "shipping_address": {
        "line1": "1350 North First Street",
        "city": "San Jose",
        "state": "CA",
        "postal_code": "95112",
        "country_code": "US",
        "recipient_name": "Todd Fulton"
    },
    "payer": {
        "payment_method": "PAYPAL"
    },
    "plan": {
        "type": "MERCHANT_INITIATED_BILLING_SINGLE_AGREEMENT",
        "merchant_preferences": {
            "return_url": "https://www.example.com/return",
            "cancel_url": "https://www.example.com/cancel",
            "notify_url": "https://www.example.com/notify",
            "accepted_pymt_type": "INSTANT",
            "skip_shipping_address": false,
            "immutable_shipping_address": true
        }
    }
}

console.log(paymentData);