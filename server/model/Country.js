const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    dialCode: {
        type: String,
        required: true,
        unique: true
    },
    iso3: {
        type: String,
        maxlength: 3,
        minlength: 3,
        unique: true,
        required: true
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