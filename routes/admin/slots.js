const express = require('express');
const router = express.Router();

const adminAuth = require('../../middleware/adminAuth');
const Slot = require('../../models/Slots');

router.post('/update', adminAuth, async (req, res) => {
    try {
        let slot = await Slot.findOne({ admin: req.user.id });
        
        const { slots } = req.body;

        if (!slot) {
            slot = new Slot({
                admin: req.user.id,
                slots
            });
            await slot.save();
            return res.status(201).send("Slots Added");
        }

        slot.slots = slots;
        await slot.save();
        res.status(200).send("Slots Updated");
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
