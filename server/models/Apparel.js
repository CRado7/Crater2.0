const mongoose = require('mongoose');

// Define the schema for the apparel
const apparelSchema = new mongoose.Schema({
  pictures: {
    type: [String],  // Array of strings to store multiple image URLs
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  style: {
    type: String,
    required: true,
    enum: ['hoodie', 't-shirt'],  // Allowed values for the style
    default: 't-shirt',
  },
  size: {
    type: String,
    required: true,
    enum: ['S', 'M', 'L', 'XL', 'XXL'],  // Example sizes
    default: 'M',
  },
  price: {
    type: Number,
    required: true,
    min: 0,  // Minimum price allowed
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
const Apparel = mongoose.model('Apparel', apparelSchema);
module.exports = Apparel;
