'use strict';

const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        'gateway': 'example',
        'gatewayMerchantId': 'exampleGatewayMerchantId'
    }
};

const cardPaymentMethod = {
    type: 'CARD',
    tokenizationSpecification: tokenizationSpecification,
    parameters: {
        allowedCardNetworks: ['VISA', 'MASTERCARD'],
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS']
    }
};

const googlePayConfiguration = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [cardPaymentMethod]
};

let googlePayClient;

function onGooglePayLoaded() {
    googlePayClient = new google.payments.api.PaymentsClient({
        environment: 'TEST',
        paymentDataCallbacks: {
            onPaymentAuthorized: onPaymentAuthorized
        }
    });

    googlePayClient.isReadyToPay(googlePayConfiguration)
        .then(response => {
            if (response.result) {
                createAndAddButton();
            } else {
                // The current user cannot pay using Google Pay. Offer
                // another payment method.
            }
        })
        .catch(error => console.error('isReadyToPay error: ', error));
}

function onPaymentAuthorized(paymentData) {
    return new Promise(function (resolve, reject) {
        // handle the response
        processPayment(paymentData)
            .then(function () {
                resolve({ transactionState: 'SUCCESS' });
            })
            .catch(function () {
                resolve({
                    transactionState: 'ERROR',
                    error: {
                        intent: 'PAYMENT_AUTHORIZATION',
                        message: 'Insufficient funds, try again. Next attempt should work.',
                        reason: 'PAYMENT_DATA_INVALID'
                    }
                });
            });
    });
}

function createAndAddButton() {
    const googlePayButton = googlePayClient.createButton({
        onClick: onGooglePayButtonClicked,
    });

    document.getElementById('container').appendChild(googlePayButton);
}

function onGooglePayButtonClicked() {
    const paymentDataRequest = { ...googlePayConfiguration };
    paymentDataRequest.merchantInfo = {
        merchantId: 'BCR2DN4TZ2V3VCLG',
        merchantName: 'Hotel Room Booking System'
    };

    paymentDataRequest.transactionInfo = {
        displayItems: [
            {
                label: "Subtotal",
                type: "SUBTOTAL",
                price: "11.00",
            },
            {
                label: "Tax",
                type: "TAX",
                price: "1.00",
            }
        ],
        countryCode: 'US',
        currencyCode: "USD",
        totalPriceStatus: "FINAL",
        totalPrice: "12.00",
        totalPriceLabel: "Total"
    };

    paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];

    googlePayClient.loadPaymentData(paymentDataRequest)
    /*
        .then(paymentData => processPayment(paymentData))
        .catch(error => console.error('loadPaymentData error: ', error));
    */
}

/*
function processPayment(paymentData) {
    const locationId = window.location.href.split('/');
    fetch(`/api/room/pay/${locationId[5]}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    });
}
*/

let attempts = 0;

function processPayment(paymentData) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            // @todo pass payment token to your gateway to process payment
            let paymentToken = paymentData.paymentMethodData.tokenizationData.token;
            console.log(paymentToken);

            if (attempts++ % 2 == 0) {
                reject(new Error('Every other attempt fails, next one should succeed'));
            } else {
                const locationId = window.location.href.split('/');
                fetch(`/api/room/pay/${locationId[5]}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: paymentToken
                    })
                });
                resolve({});
            }
        }, 500);
    });
}