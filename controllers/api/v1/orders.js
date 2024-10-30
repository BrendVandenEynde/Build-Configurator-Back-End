const Order = require('../../../models/api/v1/Order.js');
const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware to check admin authentication
const checkAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'No token provided' });

    jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
        if (err) return res.status(403).json({ status: 'error', message: 'Failed to authenticate token' });
        if (decoded.role !== 'admin') return res.status(403).json({ status: 'error', message: 'Not authorized' });
        req.userId = decoded.id; // Save the user ID for further use
        next();
    });
};

// Create a new order
exports.createOrder = async (req, res) => {
    const { customerName, customerEmail, shoeSize, laceColor } = req.body;

    try {
        const newOrder = new Order({ customerName, customerEmail, shoeSize, laceColor });
        await newOrder.save();
        res.status(201).json({ status: 'success', data: { order: newOrder } });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ status: 'success', data: { orders } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        res.status(200).json({ status: 'success', data: { order: updatedOrder } });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// Delete an order by ID (Admin only)
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        res.status(200).json({ status: 'success', message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
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
