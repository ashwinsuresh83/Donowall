const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config');
const Admin = require('../../models/Admin')
const adminToken = config.get('adminToken');
const adminAuth = require('../../middleware/adminAuth');

// authenticating the user token
router.get('/', adminAuth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        res.status(200).json(admin);
    } 
    catch (err) {
        res.status(500).send('Server Error');
    }
})

// login route admin
router.post('/login', 
    [
        // checking whether the email is valid or not
        check('email', 'Please include a valid email').isEmail(),
        // checking the password
        check('password', 'Please enter the password of minimum length 6').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })
        const { email, password } = req.body

        try {
            let admin = await Admin.findOne({ email })

            if (!admin)
                return res.status(400).json({ error: 'email does not exist' })

            const isMatch = await bcrypt.compare(password, admin.password)
            if(!isMatch) 
                return res.status(400).json({ error:'Invalid crendetials' })
            

            const payload = {
                user: {
                    id: admin.id, 
                    type: adminToken
                }
            }

            jwt.sign(
                payload,
                config.get('SESSION_SECRET'),
                {expiresIn: '5 days'},
                (err, token) => {
                    if(err) throw err
                    res.json({ token })
            })
        }
        catch (err) {
            res.status(500).send('Server error')
        }
    }
)

router.post('/change', async (_, res) => {
    try {
        const result = await Admin.updateMany({}, [{$set : { "isAccepetingAppointment": false } }]);
        res.status(200).json(result); 
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Error")
    }
})

module.exports=router