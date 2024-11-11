const mongoose = require('mongoose');

// Define the schema for the apparel
const apparelSchema = new mongoose.Schema(
  {
    pictures: {
      type: [String], // Array of strings to store multiple image URLs
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
      enum: ['Hoodie', 'T-Shirt'], // Allowed values for the style
      default: 'T-Shirt',
    },
    sizes: [
      {
        size: {
          type: String,
          required: true,
          enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // Example sizes
        },
        inStock: {
          type: Number,
          required: true,
          min: 0, // Minimum stock allowed for each size
        },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0, // Minimum price allowed
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const Apparel = mongoose.model('Apparel', apparelSchema, 'apparel');
module.exports = Apparel;
