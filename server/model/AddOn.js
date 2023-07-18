const mongoose = require('mongoose');

const AddOnSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: { values: ['Quiet location', 'Luxury linens', 'Breakfast', 'Fresh flowers', 'Champagne & Chocolate', 'Local attraction ticket'], message: '{VALUE} is invalid AddOn' },
        required: true
    },
    price: {
        type: Number,
        default: null
    }
}, { collection: 'addon', timestamps: true });

AddOnSchema.pre('save', calcAddOnPrice);

AddOnSchema.pre('findOneAndUpdate', calcAddOnPrice);

function calcAddOnPrice() {
    const AddOnPriceMapping = new Map([['Quiet location', '20'], ['Luxury linens', '35 '], ['Breakfast', '40'], ['Fresh flowers', '40'], ['Champagne & Chocolate', '60'], ['Local attraction ticket', '15']]);
    this.price = AddOnPriceMapping.get(this.type);
}

module.exports = mongoose.model('AddOn', AddOnSchema);