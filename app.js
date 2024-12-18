// Import necessary modules
require('dotenv').config(); // Load environment variables from .env file
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose'); // MongoDB connection

// Import routers for users and orders
var usersRouter = require('./routes/api/v1/users.js');
var ordersRouter = require('./routes/api/v1/orders.js');

// Create an Express app
var app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  credentials: true // Enable set cookies
}));

// Set up logging, parsing, and static files handling
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection setup using Mongoose
const mongoURI = process.env.MONGO_URI; // Get MongoDB URI from .env file

// Get JWT secret from environment variables
const jwtSecret = process.env.JWT_SECRET;

// Debugging: Ensure the MongoDB URI and JWT secret are loaded correctly
if (!mongoURI) {
  console.error("MongoDB URI is missing. Please check your .env file.");
  process.exit(1); // Exit the app if the URI is not found
}

if (!jwtSecret) {
  console.error("JWT secret is missing. Please check your .env file.");
  process.exit(1); // Exit the app if the JWT secret is not found
}

console.log('MongoDB URI:', mongoURI); // Debugging: verify URI
console.log('JWT Secret Loaded'); // Confirm JWT secret loading

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Set up routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/orders', ordersRouter);

// Catch 404 errors and forward them to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler for handling unexpected errors
app.use(function (err, req, res, next) {
  const errorResponse = {
    status: 'error',
    message: err.message,
  };

  // Add detailed error information if in development mode
  if (req.app.get('env') === 'development') {
    errorResponse.error = err;
  }

  // Send error as a JSON response
  res.status(err.status || 500).json(errorResponse);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export the app module
module.exports = app;