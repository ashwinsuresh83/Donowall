const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    f_name: {
        type: String,
        required: true
    },
    l_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile_no: {
        type: String, 
        required: true,
    },
    password: {
        type: String, 
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    blood_group: {
        type: String,
        required: true
    },
    blocked: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    image_url: {
        type: String
    },
    hasBooked: {
        type: Boolean,
        default: false
    }
});

module.exports = User = mongoose.model('user', UserSchema);