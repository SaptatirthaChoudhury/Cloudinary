const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

//Connect DB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Middleware
app.use(express.json())

//Route
app.use('/user', require('./routes/user.route'))

app.listen(5000, () => console.log('Server is running at port 5000'))