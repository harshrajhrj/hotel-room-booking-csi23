const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    hotel: {
        type: String,
        uppercase: true,
        required: true
    },
    location: {
        city: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'City',
            required: true
        },
        street: {
            type: String,
            uppercase: true,
            required: true
        }
    },
    thumbnail: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    pictures: [{
        type: mongoose.SchemaTypes.ObjectId,
        default: ''
    }],
    no_of_rooms: {
        type: Number,
        required: true
    },
    no_of_available_rooms: {
        type: Number,
        required: true
    },
    no_of_booked_rooms: {
        type: Number,
        required: true
    },
    ratings: {
        type: Number,
        min: 1,
        max: 5,
        default: 2.5
    },
    rooms: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Room',
        default: null
    }]
}, { collection: 'hotel', timestamps: true });