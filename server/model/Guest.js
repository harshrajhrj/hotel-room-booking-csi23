const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
    name: {
        type: String,
        uppercase: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    guestId: {
        type: String,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    address: {
        street: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        pincode: {
            type: String,
            default: ''
        }
    },
    contact: {
        type: Number,
        default: ''
    },
    dateOfBirth: {
        type: Date,
        default: ''
    },
    govVerification: {
        aadhar: {
            type: String,
            maxlength: [12, 'Max length exceeded'],
            default: ''
        },
        pan: {
            type: String,
            maxlength: [10, 'Max length exceeded'],
            default: '',
        },
        drivingLicense: {
            type: String,
            maxlength: [16, 'Max length exceeded'],
            default: ''
        },
        other: [{
            verificationType: {
                type: String,
                default: ''
            },
            verificationId: {
                type: String,
                default: ''
            }
        }]
    }
}, { collection: 'guest', timestamps: true });

module.exports = mongoose.model('Guest', GuestSchema);