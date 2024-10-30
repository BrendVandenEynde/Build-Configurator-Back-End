const express = require('express');
const router = express.Router();
const User = require('../../../models/api/v1/User.js');
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const config = require('config');

// Route for user registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: 'error', message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, config.get('jwtSecret'), { expiresIn: '1h' });
        res.status(200).json({ status: 'success', data: { token } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Export the router
module.exports = router;
