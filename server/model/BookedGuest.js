const mongoose = require('mongoose');

const BookedGuestSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Guest'
    },
    roomId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Room'
    },
    bookedOn: {
        type: Date,
        required: true
    },
    checkIn: {
        type: String,
        required: true
    },
    checkOut: {
        type: String,
        required: true
    },
    stayingDays: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    receipt: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    }
}, { collection: 'booking', timestamps: true });

module.exports = mongoose.model('Booking', BookedGuestSchema);