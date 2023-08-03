const googlePay = require('google-pay');

module.exports = {
    initializePayment: async (amount, currency) => {
        const paymentRequest = new googlePay.PaymentRequest({
            total: {
                amount: amount,
                currency: currency,
            },
        });

        const response = await paymentRequest.canMakePayment();

        if (response.canMakePayment) {
            const token = await paymentRequest.requestPaymentToken();

            return token;
        } else {
            return null;
        }
    },
};