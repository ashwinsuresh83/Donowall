const express = require('express');
const router = express.Router();

const adminAuth = require('../../middleware/adminAuth');
const auth = require('../../middleware/auth');
const Slot = require('../../models/Slots');

router.get('/', auth, async (req, res) => {
    try {
        const adminId = req.query.id ? req.query.id : req.user.id;

        const slot = await Slot.findOne({ admin: adminId });
        res.status(200).json(slot);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

router.post('/update', adminAuth, async (req, res) => {
    try {
        let slot = await Slot.findOne({ admin: req.user.id });

        const slots = req.body;

        if (!slot) {
            slot = new Slot({
                admin: req.user.id,
                slots
            });
            await slot.save();
            return res.status(200).json(slot);
        }

        slot.slots = slots;
        await slot.save();
        res.status(200).send(slot);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
