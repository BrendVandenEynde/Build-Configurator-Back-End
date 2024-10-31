var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var usersRouter = require('./routes/api/v1/users.js');
var ordersRouter = require('./routes/api/v1/orders.js');

var app = express();

// Enable CORS for all routes
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
app.use('/users', usersRouter);
app.use('/api/v1/orders', ordersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const errorResponse = {
    status: 'error',
    message: err.message,
  };

  // Add detailed error information in development mode
  if (req.app.get('env') === 'development') {
    errorResponse.error = err;
  }

  // render the error page
  res.status(err.status || 500).json(errorResponse); // Send error as JSON response
});

module.exports = app;
