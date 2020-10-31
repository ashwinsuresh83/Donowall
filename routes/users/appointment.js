const express = require('express');
const router = express.Router();
const moment = require('moment');

const Admin = require('../../models/Admin');
const User = require('../../models/Users');
const Slots = require('../../models/Slots');
const Appointment = require('../../models/Appointment');
const userAuth = require('../../middleware/userAuth');
const auth = require('../../middleware/auth');
const validateObjId = require('../../middleware/validateObjId');

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

router.get('/get/available/slots/:id', 
[
    userAuth,
    validateObjId('id')
], async (req, res) => {
    
    try {
        const slots = await Slots.findOne({ admin: req.params.id });
        
        if (!slots)
            return res.status(404).send(null);
        
        const todayIndex = getIndex(moment().format('dddd'));

        let result = [];

        slots.slots.forEach(slot => {
            let indexDay = getIndex(slot.day);
            
            if (indexDay === todayIndex) {
                let date = moment().add(7, 'days').format('MMMM Do YYYY');
                result.push({ time: slot.time, day: slot.day, date });
            }
            
            else if (indexDay > todayIndex) {
                let date = moment().add((indexDay - todayIndex), 'days').format('MMMM Do YYYY');
                result.unshift({ time: slot.time, day: slot.day, date });
            }
            
            else if (todayIndex > indexDay) {
                let date = moment().add((7 - todayIndex + indexDay), 'days').format('MMMM Do YYYY');
                result.push({ time: slot.time, day: slot.day, date });
            }
        });
        res.status(200).send(result);
    } 
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// booking the slot
router.post('/slot', userAuth, async (req, res) => {

    try {
        
        const user = await User.findOne({ _id: req.user.id }).select('blocked');
        
        if (user.blocked) {
            return res.status(400).json("You Are Not Allowed to Book Now.");
        }

        // const result = await Appointment.findOne({
        //     $and: [
        //         { user: req.user.id },
        //         { hasDonated: false }
        //     ]
        // });

        const body = {
            user: req.user.id,
            ...req.body
        };

        const appointment = new Appointment(body);
        await appointment.save();
        res.status(200).json(appointment);
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }

});

function getIndex(day) {
    return weekdays.indexOf(day);
}

module.exports = router;
