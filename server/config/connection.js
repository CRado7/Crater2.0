const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Crater2';
console.log('MongoDB URI:', uri);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    console.log('MongoDB URI from .env:', process.env.MONGODB_URI);

}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
});

module.exports = mongoose.connection;
