const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const Appointment = require('../../models/Appointment');

router.get('/', adminAuth, async (req, res) => {
    try {
        const appointments = await Appointment
            .find({ admin: req.user.id })
            .populate('user', ['f_name', 'l_name']);
        res.status(200).json(appointments);
    }
    catch(err) { 
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;
