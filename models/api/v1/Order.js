const mongoose = require('mongoose');

// Define the Order schema
const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true }, // Changed to String for UUID
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  shoeSize: { type: Number, required: true },
  laceColor: { type: String, required: true },
  status: {
    type: String,
    enum: ['in production', 'shipped', 'delivered', 'cancelled'],
    default: 'in production',
  },
  createdAt: { type: Date, default: Date.now },
});

// Create the Order model
const Order = mongoose.model('Order', OrderSchema);

// Export the model
module.exports = Order;
