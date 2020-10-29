const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    blood_data: [{
        name: { type: String, required: true },
        value: { type: Number, required: true }
    }],
    pincode: {
        type: Number,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    isAccepetingAppointment: {
        type: Boolean,
        default: false
    }
});

module.exports = Admin = mongoose.model('admin', AdminSchema); 
