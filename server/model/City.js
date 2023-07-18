const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    country: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Country'
    },
    state: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'State'
    },
    pincode: {
        type: Number,
        required: true,
        unique: true
    }
}, { collection: 'city', timestamps: true });

module.exports = mongoose.model('City', CitySchema);