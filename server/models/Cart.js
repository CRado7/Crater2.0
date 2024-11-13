// models/Cart.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the CartItem schema to store details for each cart item
const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel', // This allows us to dynamically reference either 'Apparel' or 'Snowboard'
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

// The cart schema will reference CartItemSchema
const CartSchema = new Schema({
  items: [CartItemSchema],
  // The cart does not need to be tied to a user account, it is anonymous
});

// Create the Cart model
const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
