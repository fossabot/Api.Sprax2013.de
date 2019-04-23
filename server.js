const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const Utils = require('./utils');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));

// Default response headers
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'User-Agent,If-None-Match,Content-Type,If-Unmodified-Since');

  next();
});

// ToDo Set caching headers on routes
app.use('/status', require('./routes/Status'));
app.use('/mojang', require('./routes/Mojang'));

// Prepare 404
app.use((_req, _res, next) => {
  next(Utils.createError(404, 'The requested resource could not be found.'));
});

// Send Error
app.use((err, _req, res, _next) => {
  // ToDo Log 5xx errors

  if (!err || !(err instanceof Error)) {
    err = Utils.createError();
  }

  res.status(err.status || 500)
    .json({
      status: err.status,
      msg: err.message
    });
});

module.exports = app;