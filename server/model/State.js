const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        uppercase : true,
        unique: true,
    },
    countryCode: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Country'
    },
    capital: {
        type: String,
        required: true,
        uppercase : true,
        unique: true
    }
}, { collection: 'state', timestamps: true });

module.exports = mongoose.model('State', StateSchema);