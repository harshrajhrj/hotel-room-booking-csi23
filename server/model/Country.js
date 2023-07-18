const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    capital: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    timezone: {
        type: String,
        required: true,
        uppercase: true
    }
}, { collection: 'country', timestamps: true });

module.exports = mongoose.model('Country', CountrySchema);