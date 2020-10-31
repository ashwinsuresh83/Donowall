const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    time:[],
    hasDonated: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        required: true
    },
    weekDay: {
        type: String,
        required: true
    },
    bookedOn: {
        type: Date, 
        default: Date.now()
    }
});

module.exports = Appointment = mongoose.model('appointment', AppointmentSchema)
