const mongoose = require('mongoose');

// Define the schema for the snowboard
const snowboardSchema = new mongoose.Schema(
  {
    picture: {
      type: [String], // Array of strings to store multiple image URLs
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
      enum: ['twin', 'directional-twin', 'directional', 'directional-powder'], // Allowed shapes
      default: 'twin',
    },
    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
        inStock: {
          type: Number,
          required: true,
          min: 0, // Minimum stock allowed for each size
        },
      },
    ],
    flex: {
      type: String,
      required: true,
      enum: ['soft', 'medium', 'stiff'], // Allowed flex values
      default: 'medium',
    },
    boardConstruction: {
      type: String,
      required: true,
      enum: ['traditional', 'hybrid', 'rocker', 'camber'], // Allowed board constructions
      default: 'traditional',
    },
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
const Snowboard = mongoose.model('Snowboard', snowboardSchema);
module.exports = Snowboard;
