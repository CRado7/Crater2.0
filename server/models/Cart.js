// models/Cart.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// CartItem schema to store product details
const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel', // Dynamically references 'Apparel' or 'Snowboard'
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Cart schema that includes a sessionId field
const CartSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
