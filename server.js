const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('config');
const jwt = require('jsonwebtoken');

// api Routes
const userSignupRoute = require('./routes/users/users');
const adminSignupRoute = require('./routes/admin/users');
const userAuthRoute = require('./routes/users/auth');
const adminAuthRoute = require('./routes/admin/auth');
const adminProfileRoute = require('./routes/admin/profile');
const userProfileRoute = require('./routes/users/profile');
const userHospital = require('./routes/users/hospital');
const slots = require('./routes/admin/slots');
const appointment = require('./routes/users/appointment');

const app = express();
// connect to database
connectDB();

app.use(express.json());

// setting up cors
// const corsOptions = {
//     origin: function (origin, callback) {
//         console.log(origin)
//         if (config.get('whitelist').indexOf(origin) !== -1)   
//             callback(null, true);
//         else 
//             callback(null, false);
//     }
// }
app.use(cors());

// base url = http://localhost:5000/api (development)
// base url = https://api-donowall.herokuapp.com/api (production)
app.use('/api/user/users', userSignupRoute);
app.use('/api/admin/users', adminSignupRoute);

app.use('/api/user/auth',userAuthRoute);
app.use('/api/admin/auth',adminAuthRoute);

app.use('/api/admin/profile', adminProfileRoute);
app.use('/api/user/profile', userProfileRoute);

app.use('/api/user/hospital', userHospital);
app.use('/api/user/appointment', appointment);

app.use('/api/admin/slot', slots);

// returns the type token
app.post('/api/type/user', (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, config.get('SESSION_SECRET'));
        res.status(200).json({ typeToken: decoded.user.type });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ err: 'Server Error' });
    }
})

//errors
app.use((_, __, next) => {
    const err = new Error('No API Route Found');
    err.status = 404;
    next(err);
})

//handling error
app.use((err, _, res, __) => {
    res.status(err.status || 500);
    res.send(err.message);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
