// models/orderSchema.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userDetails: {
    fullName: String,
    phone: String,
    country: String,
    city: String,
    state: String,
    zip: String
  },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
