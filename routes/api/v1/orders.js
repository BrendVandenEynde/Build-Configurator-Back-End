const express = require('express');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    checkAdmin
} = require('../../../controllers/api/v1/orders.js');

// POST /orders
router.post('/', createOrder);

// GET /orders/:id
router.get('/:id', getOrderById);

// GET /orders
router.get('/', getAllOrders);

// PUT /orders/:id
router.put('/:id', checkAdmin, updateOrder);

// DELETE /orders/:id
router.delete('/:id', checkAdmin, deleteOrder);

module.exports = router;