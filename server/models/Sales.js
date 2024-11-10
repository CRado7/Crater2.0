// models/Sales.js
const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  itemType: {
    type: String, // "snowboard" or "apparel"
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String, // e.g., "2024-07"
    required: true,
  },
});

const Sales = mongoose.model('Sales', salesSchema);
module.exports = Sales;
