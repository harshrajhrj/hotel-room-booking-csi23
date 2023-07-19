const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
    },
    iso: {
        type: String,
        required: true,
        uppercase: true
    },
    countryISO: {
        type: String,
        required: true,
        uppercase: true
    },
    country: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Country'
    },
    capital: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    }
}, { collection: 'state', timestamps: true });

module.exports = mongoose.model('State', StateSchema);