const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    slots: [
        {
            day: {
                type: String
            },
            time: []
        }
    ]
});

module.exports = Slot = mongoose.model('slot', SlotSchema);
