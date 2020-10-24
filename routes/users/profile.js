const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const userAuth=require('../../middleware/userAuth');
const { check, validationResult } = require('express-validator');

// profile edit route for user
router.put('/edit', 
[
    userAuth,
    [
        check('f_name', 'First Name is required').not().isEmpty(),
        check('l_name', 'Last Name is required').not().isEmpty(),
        check('mobile_no', 'Mobile Number is required').not().isEmpty(),
        check('city', 'City is required').not().isEmpty(),
        check('state', 'State is required').not().isEmpty(),
        check('blood_group', 'Blood Group is required').not().isEmpty(),
    ]
], 
async (req, res)=> {
    try {
        const errors = validationResult(req);
        // if any of the field is missing
        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array() });

        const image_url = getAvataarURL(req.body.f_name, req.body.l_name);
        req.body.image_url = image_url;

        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: req.body }, 
            { new: true }
        );

        res.status(200).json({ user });
    }
    catch(err) {
        console.log(err)
        res.status(500).json({ err: "Server Error" });
    }
});

function getAvataarURL(f_name, l_name) {
    f_name = f_name.toUpperCase();
    l_name = l_name.toUpperCase();
    return `https://avatar.oxro.io/avatar.svg?name=${f_name}+${l_name}&background=5f5f5f&color=000`;
}

module.exports=router
