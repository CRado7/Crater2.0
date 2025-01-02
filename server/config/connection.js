const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://christopherferraro34:Lakewood84@cluster0.yoqo2y2.mongodb.net/Crater2?retryWrites=true&w=majority';
console.log('MongoDB URI:', uri);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
});

module.exports = mongoose.connection;
