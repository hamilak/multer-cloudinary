const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Mongodb connected');
    })
    .catch((err) => {
        console.log('Failed to connect to mongodb:', err);
    })