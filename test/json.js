const paymentData = {
    intent: "AUTHORIZE",
    processing_instruction: "ORDER_SAVED_EXPLICITLY",
    application_context: {
        brand_name: "Todd's Clothing Shop",
        locale: "en-NL",
        landing_page: "BILLING",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        return_url: "https://www.paypal.com/checkoutnow/error",
        cancel_url: "https://www.paypal.com/checkoutnow/error"
    },
    purchase_units: [
        {
            reference_id: "MAR01_001_REFID",
            custom_id: "MAR01_001_INTERNAL_ONLY",
            description: "Purchase Unit Description",
            soft_descriptor: "soft description",
            invoice_id: "MAR01_001_INVOICEID",
            amount: {
                currency_code: "USD",
                value: 15.00,
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: 12.00
                    },
                    tax_total: {
                        currency_code: "USD",
                        value: 2.00
                    },
                    shipping: {
                        currency_code: "USD",
                        value: 1.00
                    },
                    handling: {
                        currency_code: "USD",
                        value: 0.00
                    },
                    insurance: {
                        currency_code: "USD",
                        value: 0.0
                    },
                    shipping_discount: {
                        currency_code: "USD",
                        value: 0.00
                    }
                }
            },
            items: [
                {
                    name: "T-Shirt",
                    description: "Green XL",
                    sku: "sku01",
                    unit_amount: {
                        currency_code: "USD",
                        value: 6.00
                    },
                    tax: {
                        currency_code: "USD",
                        value: 1.00
                    },
                    quantity: 2,
                    category: "PHYSICAL_GOODS"
                }
            ],
            shipping: {
                method: "United States Postal Service",
                address: {
                    // name: {
                    //     given_name: "Sarah",
                    //     surname: "Serverton"
                    // },
                    address_line_1: "123 Townsend St",
                    address_line_2: "Floor 4",
                    admin_area_2: "San Francisco",
                    admin_area_1: "CA",
                    postal_code: "94107",
                    country_code: "US"
                }
            }
        }
    ]
}

console.log(JSON.stringify(paymentData, null, 0));