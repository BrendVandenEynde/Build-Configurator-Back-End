const Order = require('../../../models/api/v1/Order.js');
const jwt = require('jsonwebtoken');
const config = require('config');
const { v4: uuidv4 } = require('uuid');

// Helper function for standardized error responses
const errorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({ status: 'error', message });
};

// Middleware to check admin authentication
const checkAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return errorResponse(res, 'No token provided', 401);

    jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
        if (err) return errorResponse(res, 'Failed to authenticate token', 403);
        if (decoded.role !== 'admin') return errorResponse(res, 'Not authorized', 403);
        req.userId = decoded.id; // Save the user ID for further use
        next();
    });
};

// Validate layer materials and colors
const validateLayers = (layers, modelType) => {
    const validLayerMaterials = [
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
    ];

    let layerKeys;
    if (modelType === 'sneaker') {
        layerKeys = ['inside', 'laces', 'outside1', 'outside2', 'sole1', 'sole2'];
    } else if (modelType === 'heel') {
        layerKeys = ['Object_2', 'Object_3', 'Object_4', 'Object_5'];
    }

    for (const key of layerKeys) {
        const layer = layers[key];
        if (layer) {
            const { material, color } = layer;
            if (!validLayerMaterials.includes(material)) {
                return `Invalid material for ${key}: ${material}`;
            }
            if (typeof color !== 'string' || color.trim() === '') {
                return `Invalid color for ${key}`;
            }
        }
    }
    return null; // Return null if validation passes
};

// Create a new order
const createOrder = async (req, res) => {
    const {
        customerName,
        customerEmail,
        shoeSize,
        address,
        layers,
        modelType
    } = req.body;

    // Validate modelType
    if (!['sneaker', 'heel'].includes(modelType)) {
        return errorResponse(res, 'Invalid model type', 400);
    }

    // Validate address
    if (!address || typeof address !== 'string' || address.trim() === '') {
        return errorResponse(res, 'Address is required', 400);
    }

    // Validate layers
    const layerError = validateLayers(layers, modelType);
    if (layerError) {
        return errorResponse(res, layerError, 400);
    }

    try {
        const newOrder = new Order({
            orderNumber: uuidv4(), // Use UUID for unique order number
            customerName,
            customerEmail,
            shoeSize,
            address,
            sneakerLayers: modelType === 'sneaker' ? layers : undefined, // Assign sneaker layers if model type is sneaker
            heelLayers: modelType === 'heel' ? layers : undefined, // Assign heel layers if model type is heel
            modelType
        });
        await newOrder.save();
        res.status(201).json({ status: 'success', data: { order: newOrder } });
    } catch (error) {
        errorResponse(res, `Error creating order: ${error.message}`, 500);
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const { sortby, modelType } = req.query;
        const filter = modelType ? { modelType } : {};
        let orders;

        // Sort orders based on query parameters
        if (sortby === 'votes') {
            orders = await Order.find(filter).sort({ votes: -1 });
        } else if (sortby === 'date') {
            orders = await Order.find(filter).sort({ createdAt: -1 });
        } else {
            orders = await Order.find(filter);
        }

        res.status(200).json({ status: 'success', data: { orders } });
    } catch (error) {
        errorResponse(res, `Error retrieving orders: ${error.message}`, 500);
    }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        errorResponse(res, `Error retrieving order: ${error.message}`, 500);
    }
};

// Update an order by ID
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['in production', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return errorResponse(res, 'Invalid status', 400);
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return errorResponse(res, 'Order not found', 404);
        }
        res.status(200).json({ status: 'success', data: { order: updatedOrder } });
    } catch (error) {
        errorResponse(res, `Error updating order: ${error.message}`, 500);
    }
};

// Delete an order by ID (Admin only)
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return errorResponse(res, 'Order not found', 404);
        }
        res.status(200).json({ status: 'success', message: 'Order deleted successfully' });
    } catch (error) {
        errorResponse(res, `Error deleting order: ${error.message}`, 500);
    }
};

// Exporting the controller methods
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    checkAdmin, // Exporting the middleware
};
