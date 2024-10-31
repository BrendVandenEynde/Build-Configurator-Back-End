const express = require('express');
const router = express.Router();
const { registerUser, loginUser, checkAdmin } = require('../../../controllers/api/v1/users.js');

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Export the router
module.exports = router;