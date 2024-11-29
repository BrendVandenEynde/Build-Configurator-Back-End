const mongoose = require('mongoose');

// Define the Layer schema
const LayerSchema = new mongoose.Schema({
    material: { type: String, required: true, enum: ['none selected', 'leather', 'cotton', 'synthetic', 'rubber'] },
    color: { type: String, required: true }
});

// Define the Order schema
const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true }, // Changed to String for UUID
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    shoeSize: { type: Number, required: true },
    layers: {
        inside: { type: LayerSchema, required: true },
        laces: { type: LayerSchema, required: true },
        outside1: { type: LayerSchema, required: true },
        outside2: { type: LayerSchema, required: true },
        sole1: { type: LayerSchema, required: true },
        sole2: { type: LayerSchema, required: true }
    },
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
