const mongoose = require('mongoose');

// Define the schema for the snowboard
const snowboardSchema = new mongoose.Schema({
  picture: {
    type: [String],  // URL to the image or path to the file
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  shape: {
    type: String,
    required: true,
    enum: ['directional', 'twin', 'directional-twin'],  // Example of allowed shapes
    default: 'twin',
  },
  sizes: {
    type: [String],  // Array to store available sizes (e.g., ['148', '152', '156'])
    required: true,
    validate: {
      validator: function(v) {
        // Validate that sizes are an array of strings and not empty
        return Array.isArray(v) && v.length > 0 && v.every(size => typeof size === 'string');
      },
      message: 'Sizes must be an array of strings.',
    },
  },
  flex: {
    type: String,
    required: true,
    enum: ['soft', 'medium', 'stiff'],  // Example of allowed flex values
    default: 'medium',
  },
  boardConstruction: {
    type: String,
    required: true,
    trim: true,  // To remove leading and trailing spaces
  },
  price: {
    type: Number,
    required: true,
    min: 0,  // Minimum price allowed
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
const Snowboard = mongoose.model('Snowboard', snowboardSchema);
module.exports = Snowboard;
