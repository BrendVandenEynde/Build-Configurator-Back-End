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

// Create a new order
exports.createOrder = async (req, res) => {
    const { customerName, customerEmail, shoeSize, laceColor } = req.body;

    try {
        const newOrder = new Order({
            orderNumber: uuidv4(), // Use UUID for unique order number
            customerName,
            customerEmail,
            shoeSize,
            laceColor
        });
        await newOrder.save();
        res.status(201).json({ status: 'success', data: { order: newOrder } });
    } catch (error) {
        errorResponse(res, error.message, 400);
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const { sortby } = req.query;
        let orders;

        if (sortby === 'votes') {
            orders = await Order.find().sort({ votes: -1 });
        } else if (sortby === 'date') {
            orders = await Order.find().sort({ createdAt: -1 });
        } else {
            orders = await Order.find();
        }

        res.status(200).json({ status: 'success', data: { orders } });
    } catch (error) {
        errorResponse(res, error.message);
    }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        errorResponse(res, error.message);
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['in production', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return errorResponse(res, 'Invalid status', 400);
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) {
            return errorResponse(res, 'Order not found', 404);
        }
        res.status(200).json({ status: 'success', data: { order: updatedOrder } });
    } catch (error) {
        errorResponse(res, error.message, 400);
    }
};

// Delete an order by ID (Admin only)
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return errorResponse(res, 'Order not found', 404);
        }
        res.status(200).json({ status: 'success', message: 'Order deleted successfully' });
    } catch (error) {
        errorResponse(res, error.message);
    }
};

// Exporting the controller methods
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    checkAdmin // Exporting the middleware
};