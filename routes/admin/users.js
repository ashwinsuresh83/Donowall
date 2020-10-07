const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminToken = config.get('adminToken');
const Admin = require('../../models/Admin');

router.get('/', (_, res) => res.status(200).send('admin signup route is working'));

router.post('/', 
[   
    check('name', 'Hospital name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    check('contact', 'Contact is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('pincode', 'Pincode is required').not().isEmpty(),
],  
async (req, res) => {
    try {
        const errors = validationResult(req);

        // if the fields are missing
        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array() });

        const {
            name,
            city,
            state,
            address,
            email,
            password,
            pincode,
            contact
        } = req.body;

        let admin = await Admin.findOne({ email });

        // if admin exists
        if (admin)
            return res.status(400).json({ error: "User Already Exists" });

        admin = new Admin({
            name,
            city,
            state,
            address,
            email,
            password,
            pincode,
            contact
        });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();
        
        const payload = {
            user: {
                id: admin.id,
                type: adminToken
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
        res.status(500).send('Server Error')
    }
})

module.exports = router;
