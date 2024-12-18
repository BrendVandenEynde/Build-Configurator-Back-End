const User = require('../../../models/api/v1/User.js');
const jwt = require('jsonwebtoken');
const config = require('config'); // Ensure you import config for JWT secret

// Middleware to check if the user is an admin
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

// User registration
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: 'error', message: 'Username and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'Username already exists' });
        }

        // Create and save the new user
        const newUser = new User({ username, password });
        await newUser.save();
        return res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// User login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: 'error', message: 'Username and password are required' });
    }

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: 'error', message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, config.get('jwtSecret'), { expiresIn: '1h' });
        return res.status(200).json({ status: 'success', data: { token } });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Exporting the controller methods
module.exports = {
    registerUser,
    loginUser,
    checkAdmin,
};