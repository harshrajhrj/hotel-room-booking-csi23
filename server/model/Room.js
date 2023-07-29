const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: { values: ['Single bed', 'Double bed'], message: '{VALUE} is not supported' },
        required: true
    },
    hotel: {
        type: mongoose.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    bedSize: {
        type: String,
        enum: { values: ['Small', 'Medium', 'Large', 'Extra large'], message: '{VALUE} is not supported' },
        default: 'Medium'
    },
    floor: {
        type: String,
        enum: { values: ['Upper', 'Middle', 'Bottom'], message: '{VALUE} is not supported' },
        default: 'Bottom'
    },
    view: {
        type: Boolean,
        default: true
    },
    picture: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    },
    booked: {
        type: Boolean,
        default: false
    },
    bookedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Booking',
        default: null
    },
    checkIn: {
        type: Date,
        default: null
    },
    checkOut: {
        type: Date,
        default: null
    },
    addOns: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'AddOn',
        default: null
    }],
    price: {
        type: Number,
        default: null
    }
}, { collection: 'room', timestamps: true });

/**
 * Calculates AddOnPrice
 * @returns Number
 */
RoomSchema.methods.calcAddOnsPrice = function () {
    let price = this.price;
    this.addOns.forEach(addOn => {
        price += addOn.price;
    })
    return price;
}

/**
 * Resets checkIn and checkOut if no booking
 */
RoomSchema.methods.checkInOutStatus = function () {
    if (!this.booked)
        this.checkIn = this.checkOut = null;
}

module.exports = mongoose.model('Room', RoomSchema);