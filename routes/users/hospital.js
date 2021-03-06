const express = require('express');
const router = express.Router();

const User = require('../../models/Users');
const Admin = require('../../models/Admin');
const userAuth = require('../../middleware/userAuth');

router.get('/all/hospitals', userAuth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).select(['city']);
        
        const hospitals = await Admin.find({
            $and: [
                { image: { $ne: null } },
                { city: user.city }
            ]
        })
        .select(['-password', '-blood_data', '-date', '-email']);
        res.status(200).json({ hospitals }); 
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// get only one hosiptal details
router.get('/:id', userAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const hospital = await Admin.findOne({
            $and: [
                { _id: id },
                { image: { $ne: null } }
            ]
        }).select('-password');

        if (!hospital)
            return res.status(404).json({ error: "Not Found" });
        
        res.status(200).json({ hospital });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
