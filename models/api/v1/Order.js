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
        ],
        default: 'none selected'
    },
    color: { type: String, required: true, default: '#000000' }
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
        ],
        default: 'none selected'
    },
    color: { type: String, required: true, default: '#000000' }
});

// Define the Order schema
const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    shoeSize: { type: Number, required: true },
    address: { type: String, required: true },
    sneakerLayers: {
        inside: { type: SneakerLayerSchema, required: false },
        laces: { type: SneakerLayerSchema, required: false },
        outside1: { type: SneakerLayerSchema, required: false },
        outside2: { type: SneakerLayerSchema, required: false },
        sole1: { type: SneakerLayerSchema, required: false },
        sole2: { type: SneakerLayerSchema, required: false }
    },
    heelLayers: {
        Object_2: { type: HeelLayerSchema, required: false },
        Object_3: { type: HeelLayerSchema, required: false },
        Object_4: { type: HeelLayerSchema, required: false },
        Object_5: { type: HeelLayerSchema, required: false }
    },
    modelType: {
        type: String,
        required: true,
        enum: ['sneaker', 'heel']
    },
    status: {
        type: String,
        enum: ['in production', 'shipped', 'delivered', 'cancelled'],
        default: 'in production'
    },
    createdAt: { type: Date, default: Date.now }
});

// Create the Order model
const Order = mongoose.model('Order', OrderSchema);

// Export the model
module.exports = Order;