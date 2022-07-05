var User = require('../models/users');
var async = require('async');
const { body,validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');

exports.index = function(req, res, next){
	res.render('index', {title: 'club House'});
};

exports.sign_up_form_get = function(req, res, next){
	res.render('sign_up', {title: 'Sign-up'});
};

exports.sign_up_form_post = [
	body('firstname').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
	.isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
	body('lastname').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
	.isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
	body('email').isEmail().escape().withMessage('First name must be specified.'),
	(req, res, next) => {
		console.log(req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()){
			res.render('sign_up', {title: 'Sign', errors: errors.array()});
			return;
		}
			bcrypt.hash(req.body.psw, 10, (err, hashedPassword) => {
				if (err)
					next(err);
				console.log({hashedPassword});
				// otherwise, store hashedPassword in DB
				var user = new User({
					first_name: req.body.firstname,
					last_name: req.body.lastname,
					email: req.body.email,
					password: hashedPassword
			});
			user.save(function(err){
				if (err){
					console.log("error");
					return next(err);
				}
				res.redirect("/");	//! think about url 
			});
		});
	}
];

exports.log_in_form_get = function(req, res, next){
};

exports.log_in_form_post = function(req, res, next){
};