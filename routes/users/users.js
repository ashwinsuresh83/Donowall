const express = require('express');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userToken = config.get('userToken');
const User = require('../../models/Users');

// sample route
router.get('/', (_, res) => {
    res.status(200).send('tis working')
})

// signup route for users
router.post('/',
    [
        check('f_name', 'First Name is required').not().isEmpty(),
        check('l_name', 'Last Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        check('mobile_no', 'Mobile Number is required').not().isEmpty(),
        check('city', 'City is required').not().isEmpty(),
        check('state', 'State is required').not().isEmpty(),
        check('blood_group', 'Blood Group is required').not().isEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            // if the fields are missing
            if (!errors.isEmpty())
                return res.status(400).json({ error: errors.array() });

            const {
                f_name,
                l_name,
                email,
                password,
                mobile_no,
                city,
                state,
                blood_group
            } = req.body;

            const image_url = getAvataarURL(f_name, l_name);

            let user = await User.findOne({ email });
            // if the user is already present
            if (user)
                return res.status(400).json({ error: "User Already Exists" });

            user = new User({
                f_name,
                l_name,
                email,
                password,
                mobile_no,
                city,
                state,
                blood_group,
                image_url
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                    type: userToken
                }
            };

            jwt.sign(
                payload,
                config.get('SESSION_SECRET'),
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err
                    res.json({ token })
            });
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    })

function getAvataarURL(f_name, l_name) {
    f_name = f_name.toUpperCase();
    l_name = l_name.toUpperCase();
    return `https://avatar.oxro.io/avatar.svg?name=${f_name}+${l_name}&background=5f5f5f&color=000`;
}

module.exports = router;
