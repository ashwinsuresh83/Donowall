const express = require('express');
const connectDB = require('./config/db');

// api Routes
const userRoute = require('./routes/users/users');

const app = express();
// connect to database
connectDB();

app.use(express.json({extented: false}));

// base url = http://localhost:5000/api
app.use('/api/user/users', userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
