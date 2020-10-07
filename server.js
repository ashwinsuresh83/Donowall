const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('config');

// api Routes
const userSignupRoute = require('./routes/users/users');
const adminSignupRoute = require('./routes/admin/users');
const userAuthRoute=require('./routes/users/auth');
const adminAuthRoute=require('./routes/admin/auth');

const app = express();
// connect to database
connectDB();

app.use(express.json());

// setting up cors
const corsOptions = {
    origin: function (origin, callback) {
        if (config.get('whitelist').indexOf(origin) !== -1)   
            callback(null, true);
        else 
            callback(null, false);
    }
}
app.use(cors(corsOptions));

// base url = http://localhost:5000/api
app.use('/api/user/users', userSignupRoute);
app.use('/api/admin/users', adminSignupRoute);

app.use('/api/user/auth',userAuthRoute);
app.use('/api/admin/auth',adminAuthRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
