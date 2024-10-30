const express = require('express');
const router = express.Router();
const Order = require('../../../models/api/v1/Order.js');
const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware for admin authentication
const adminAuth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }
        req.user = decoded; // Save the decoded user info
        next();
    });
};

// POST /orders
router.post('/', async (req, res) => {
    try {
        const { customerName, customerEmail, shoeSize, laceColor } = req.body;

        const newOrder = new Order({
            orderNumber: await Order.countDocuments() + 1, // Generate order number
            customerName,
            customerEmail,
            shoeSize,
            laceColor
        });

        await newOrder.save();
        res.status(201).json({ status: 'success', data: newOrder });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /orders/:id
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        res.status(200).json({ status: 'success', message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT/PATCH /orders/:id
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { status } = req.body; // Get the status from the request body
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        res.status(200).json({ status: 'success', data: order });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /orders/:id
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }
        res.status(200).json({ status: 'success', data: order });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /orders
router.get('/', async (req, res) => {
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

        res.status(200).json({ status: 'success', data: orders });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
