const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config');
const User = require('../../models/Users');
const userToken = config.get('userToken');

// authenticating the user token
router.get('/login', (_, res) => {
    res.status(200).send('tis working')
})
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
            let user = await User.findOne({ email })

            if (!user)
                return res.status(400).json({ error: 'email does not exist',email:email })

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) 
                return res.status(400).json({ error:'Invalid crendetials'  })
            

            const payload = {
                user: {
                    id: user.id,
                    type: userToken
                }
            }

            jwt.sign(
                payload,
                config.get('SESSION_SECRET'),
                {expiresIn: "5 days"},
                (err, token) => {
                    if(err) throw err
                    res.json({ token });
            })
        }
        catch (err) {
            res.status(500).send('Server error')
        }
    }
)
module.exports=router