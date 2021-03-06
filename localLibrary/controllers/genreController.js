var Genre = require('../models/genre');

var Book = require('../models/book');
var async = require('async');
const { findById } = require('../models/book');
const { body,validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
	Genre.find()
	.sort({name: 1})
	.exec(function(err, list_genres){
		if (err)
			return next(err);
		res.render('genre_list', {title: 'Genre List', error: err, 
		list_genres: list_genres });
	});
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
	async.parallel({
		genre: function(callback){
			Genre.findById(req.params.id)
			.exec(callback);
		},
		genre_books: function(callback){
			Book.find({'genre': req.params.id})
			.exec(callback);
		},
	}, function (err, results){
		if (err)
			return next (err);
		if (results.genre == null) // No result
		{
			var err = new Error('Genre not found');
			res.status = 404;
			return next(err);
		}
		 // Successful, so render
		res.render('genre_detail', { title: 'Genre Detail', 
		genre: results.genre, genre_books: results.genre_books });
	});
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
	res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.

/*
	instead of being a single middleware function (with arguments (req, res, next)) the controller
	specifies an array of middleware functions. 
	The array is passed to the router function and each method is called in order.
	This approach is needed, because the validators are middleware functions.
*/

exports.genre_create_post = [
    body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(), // first one
    (req, res, next) => {
        const errors = validationResult(req);
        var genre = new Genre({ name: req.body.name });
        if (!errors.isEmpty())
		{
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        	return;
        }
        else
		{
            Genre.findOne({ 'name': req.body.name })
            .exec( function(err, found_genre)
			{
				if (err)
					return next(err);
				if (found_genre)
				{
					// Genre exists, redirect to its detail page.
					res.redirect(found_genre.url);
				}
				else
				{
					// Genre saved. Redirect to genre detail page.
					genre.save(function (err) {
					if (err) { return next(err); }
					res.redirect(genre.url);
					});
				}
            });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Genre update POST');
};
