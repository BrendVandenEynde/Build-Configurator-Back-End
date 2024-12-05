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

// Enable CORS for specific origins
const allowedOrigins = [
  'http://localhost:3000', // Allow local frontend
  'file://',                // Allow Electron renderer
  // Add any other domains you want to allow
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true // If you need to allow cookies, set this to true
}));

// Set up logging, parsing, and static files handling
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection setup using Mongoose
const mongoURI = process.env.MONGO_URI; // Get MongoDB URI from .env file

// Debugging: Ensure the MongoDB URI is loaded correctly
if (!mongoURI) {
  console.error("MongoDB URI is missing. Please check your .env file.");
  process.exit(1); // Exit the app if the URI is not found
}

console.log('MongoDB URI:', mongoURI); // Debugging: verify URI

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Set up routes
app.use('/users', usersRouter);
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

// Export the app module
module.exports = app;
