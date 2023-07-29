const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    hotel: {
        type: String,
        uppercase: true,
        unique: true,
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
        default: null
    },
    pictures: [{
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    }],
    no_of_rooms: {
        type: Number,
        default: 10
    },
    no_of_available_rooms: {
        type: Number,
        default: 10
    },
    no_of_booked_rooms: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 2.5
    },
    rooms: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Room',
        unique: true,
        default: null
    }]
}, { collection: 'hotel', timestamps: true });

/**
 * Calculate total rooms
 */
HotelSchema.methods.calcTotalRooms = function () {
    this.no_of_rooms = this.rooms.length;
}

/**
 * Calculate the available and booked rooms
 */
HotelSchema.methods.calcAvailableRooms = function () {
    let count = 0;
    for (const room of this.rooms) {
        if (!room.booked) {
            count++;
        }
    }
    this.no_of_available_rooms = count;
    this.no_of_booked_rooms = this.no_of_rooms - count;
}

/**
 * Updates booking count
 */
HotelSchema.methods.BookRoom = function () {
    this.no_of_available_rooms = this.no_of_available_rooms - 1;
    this.no_of_booked_rooms = this.no_of_booked_rooms + 1;
}

module.exports = mongoose.model('Hotel', HotelSchema);