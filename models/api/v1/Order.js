const mongoose = require('mongoose');

// Define the Layer schema for sneakers
const SneakerLayerSchema = new mongoose.Schema({
    material: {
        type: String,
        required: true,
        enum: [
            'none selected',
            'army',
            'crocodile',
            'glitter',
            'leather',
            'leopard',
            'blocked',
            'zebra',
            'flower',
            'pizza'
        ]
    },
    color: { type: String, required: true }
});

// Define the Layer schema for heels
const HeelLayerSchema = new mongoose.Schema({
    material: {
        type: String,
        required: true,
        enum: [
            'none selected',
            'army',
            'crocodile',
            'glitter',
            'leather',
            'leopard',
            'blocked',
            'zebra',
            'flower',
            'pizza'
        ]
    },
    color: { type: String, required: true }
});

// Define the Order schema
const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true }, // Changed to String for UUID
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    shoeSize: { type: Number, required: true },
    sneakerLayers: {
        inside: { type: SneakerLayerSchema, required: true },
        laces: { type: SneakerLayerSchema, required: true },
        outside1: { type: SneakerLayerSchema, required: true },
        outside2: { type: SneakerLayerSchema, required: true },
        sole1: { type: SneakerLayerSchema, required: true },
        sole2: { type: SneakerLayerSchema, required: true }
    },
    heelLayers: {
        Object_2: { type: HeelLayerSchema, required: true },
        Object_3: { type: HeelLayerSchema, required: true },
        Object_4: { type: HeelLayerSchema, required: true },
        Object_5: { type: HeelLayerSchema, required: true }
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