// var process = require('process');
// var envs = require('envs');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*******************************************/
/*************** BEGIN: ROUTES**************/

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// app.set('environment', envs('NODE_TLS_REJECT_UNAUTHORIZED', '0'));

var index = require('./routes/index');
app.use('/', index);

var auth = require('./routes/auth');
app.use('/auth', auth);

var ordersV2 = require('./routes/orders_v2');
app.use('/v2/orders', ordersV2);

var paymentsV1 = require('./routes/payments_v1');
app.use('/v1/payments', paymentsV1);

var paymentsV2 = require('./routes/payments_v2');
app.use('/v2/payments', paymentsV2);

var beam = require('./routes/beam');
app.use('/beam', beam);

var nvp = require('./routes/nvp');
app.use('/nvp', nvp);

/*******************************************/
/*************** END: ROUTES ***************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
