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

async function onGooglePayButtonClicked() {
    const paymentDataRequest = { ...googlePayConfiguration };
    paymentDataRequest.merchantInfo = {
        merchantId: 'BCR2DN4TZ2V3VCLG',
        merchantName: 'Hotel Room Booking System'
    };

    const Room = window.location.href.split('/')[7];
    let totalPrice = '';
    let roomPrice = '';
    let stayingDays = '';
    await fetch(`/v1/room/checkout/price/${Room}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((response) => response.json())
        .then((data) => {
            if (data.message === 'N/A')
                window.location.href = `/v1/room/checkout/payment/failed/${data.hotel}`
            else {
                totalPrice = data.price;
                roomPrice = data.roomId.price;
                stayingDays = data.stayingDays;
            }
        })

    paymentDataRequest.transactionInfo = {
        displayItems: [
            {
                label: "Room Price(per day)",
                type: "LINE_ITEM",
                price: `${roomPrice}`,
                status: 'FINAL'
            },
            {
                label: `Room Price(${stayingDays} days)`,
                type: "LINE_ITEM",
                price: `${parseInt(roomPrice, 10) * parseInt(stayingDays, 10)}`,
                status: 'FINAL'
            },
            {
                label: "Subtotal(incl. tax)",
                type: "SUBTOTAL",
                price: `${totalPrice}`,
            },
        ],
        countryCode: 'US',
        currencyCode: "USD",
        totalPriceStatus: "FINAL",
        totalPrice: `${totalPrice}`,
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

            if (attempts++ % 2 == 0) {
                reject(new Error('Every other attempt fails, next one should succeed'));
            } else {
                const locationId = window.location.href.split('/')[7];
                fetch(`/v1/room/checkout/gateway/${locationId}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: paymentToken
                    })
                }).then((response) => response.json())
                    .then((data) => {
                        window.location.href = `/v1/room/checkout/payment/success/${data.hotel}`;
                    });
                resolve({});
            }
        }, 500);
    });
}