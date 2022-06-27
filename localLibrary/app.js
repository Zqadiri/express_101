// we import some node libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/*
  require() modules from our routes directory. These modules/files contain code for 
  handling particular sets of related "routes" (URL paths)
*/

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');

// create the app object 
var app = express();

// Database connection
var mongoose  = require('mongoose'); // import the module
// mongodb+srv://<username>:<password>@cluster0.8t04tva.mongodb.net/?retryWrites=true&w=majority 
var mongoURL = 'mongodb+srv://zzz:bigbangB+2006@cluster0.8t04tva.mongodb.net/local_library?retryWrites=true&w=majority'; 
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology:true
}) //set up default mongoose connection
var db = mongoose.connection; // get the default connection
db.on('error', console.error.bind(console, 'Mongi connection error : '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add the middleware libraries that we imported above into the request handling chain.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// we add our (previously imported) route-handling code to the request handling chain
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

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

/*
  This file creates an express application object
  (named app, by convention), sets up the application with 
  various settings and middleware, and then exports the app from the module.
*/

module.exports = app;
