const express = require('express');
const router = express.Router();

const adminAuth = require('../../middleware/adminAuth');
const Appointment = require('../../models/Appointment');
const User = require('../../models/Users'); 

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
});

router.get('/user/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id }).select('-password');

        if (!user)
            return res.status(404).json({ error: "Not Found" });
        
        res.status(200).json({ user });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/previous/appointments/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await Appointment.find({ user: id });
        
        res.status(200).json({ appointments })
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
