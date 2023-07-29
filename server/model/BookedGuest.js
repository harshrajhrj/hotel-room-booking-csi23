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
    bookedFrom: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    receipt: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    }
}, { collection: 'booking', timestamps: true });

module.exports = mongoose.model('Booking', BookedGuestSchema);