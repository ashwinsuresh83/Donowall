const express = require('express');
const connectDB = require('./config/db');

// api Routes
const userSignupRoute = require('./routes/users/users');
const adminSignupRoute = require('./routes/admin/users');

const app = express();
// connect to database
connectDB();

app.use(express.json({extented: false}));

// base url = http://localhost:5000/api
app.use('/api/user/users', userSignupRoute);
app.use('/api/admin/users', adminSignupRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
