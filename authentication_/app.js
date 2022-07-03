var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Database connection
var mongoURL = 'mongodb+srv://zzz:bigbangB+2006@cluster0.8t04tva.mongodb.net/auth?retryWrites=true&w=majority'; 
mongoose.connect(mongoURL, {
	useNewUrlParser: true,
	useUnifiedTopology:true
}) //set up default mongoose connection
var db = mongoose.connection; // get the default connection
db.on('error', console.error.bind(console, 'Mongo connection error : '));

var User = require('./models/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//! Setting up the localStrategy --------------------------------

/*
This function is what will be called when we use the passport.authenticate() function
*/

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) { 
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: "Incorrect username" });
			}
			if (user.password !== password) {
				return done(null, false, { message: "Incorrect password" });
			}
			return done(null, user);
		});
	})
	);
	
	//! Sessions and serialization ----------------------------------
	
	/*
	https://www.theodinproject.com/lessons/nodejs-authentication-basics#authentication
	*/
	
	passport.serializeUser(function(user, done) {
	 done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	
//! Routers ---------------------------------------------------

// app.use(function(req, res, next) {
// 		res.locals.currentUser = req.user;
// 		next();
// });

app.get("/", (req, res) => {
	res.render("index", { user: req.user });
});

app.get("/sign-up", (req, res) => {
	res.render("sign-up-form")
});

app.post("/sign-up", (req, res, next) => {
	const user = new User({
		username: req.body.username, 
		password: req.body.password,
	});
	user.save(function (err) {
		if (err) { 
			return next(err);
		}
		res.redirect("/");
	});
});

app.post("/log-in", 
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/"
	})
);

app.get("/log-out", (req, res) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});
	
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(passport.initialize());
app.use(passport.session());

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
