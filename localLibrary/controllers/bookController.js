var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookInstance');
const { body,validationResult } = require('express-validator');

var async = require('async');

// index() function for displaying the site welcome page
exports.index = function(req, res) {
	/*
		These functions are all started at the same time. When all of them have 
		completed the final callback is invoked with the counts in the results parameter
	*/
	async.parallel({
		/*
			the countDocuments() method to get the number of instances of each model
			This is called on a model, with an optional set of conditions to match against 
			in the first argument, and a callback in the second argument
		*/
			book_count: function(callback) {
				Book.countDocuments({}, callback);
			},
			book_instance_count: function(callback) {
				BookInstance.countDocuments({}, callback);
			},
			book_instance_available: function(callback){
				BookInstance.countDocuments({status:'Available'}, callback);
			},
			author_count: function(callback){
				Author.countDocuments({}, callback);
			},
			genre_count: function(callback){
				Genre.countDocuments({}, callback)
			}
		}, function(err, results) {
			// we render the page whether or not there was an error
			res.render('index', {title: 'Local Library', error: err, data: results });
	});
};  

// Display list of all books.
exports.book_list = function(req, res, next) {
	// console.log("book req", req.body);
	/*
		find return all Book objects, selecting to return only the title and author
		(it will also return the _id and virtual fields)
	*/
	Book.find({}, 'title author')
	.sort([['title', 'ascending']])	// sorts the results by the title alphabetically
	.populate('author')	// this will replace the stored book author id with the full author details.
	.exec(function (err, list_books)
	{
		console.log("here : ", list_books);
		if (err)
			return next(err); 
		res.render('book_list', { title: 'Book List', book_list: list_books });
	});
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
	async.parallel({
		book: function(callback) {
			Book.findById(req.params.id)
			  .populate('author')
			  .populate('genre')
			  .exec(callback);
		},
		book_instance: function(callback) {

		  BookInstance.find({ 'book': req.params.id })
		  .exec(callback);
		},
	}, function(err, results) {
		if (err)
			return next(err);
		if (results.book == null) 
		{ // No results.
			var err = new Error('Book not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render.
		res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance } );
	});
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
	async.parallel({
		authors: (callback) => {
			Author.find(callback);
		},
		genres:  (callback) =>{
			Genre.find(callback);
		},
	}, function (err, results) {
		if (err)
			return next(err);
		res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
	});
};

// Handle book create on POST.
exports.book_create_post = [
	(req, res, next) => {
		// console.log("pre convertion", req.body);
		// instanceof : Checks the current object and returns true if the object is of the specified object type.
		if (!(req.body.genre instanceof Array))
		{
			if (typeof req.body.genre === 'undefined')
				req.body.genre = [];
			else
				req.body.genre = new Array(req.body.genre);
		}
		next();
	},

	// Validate and sanitize fields.
	body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
	body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
	body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
	body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
	body('genre.*').escape(),

	// After Validation
	(req, res, next) => {
		const errors = validationResult(req);
		var book = new Book(
			{ title: req.body.title,
			  author: req.body.author,
			  summary: req.body.summary,
			  isbn: req.body.isbn,
			  genre: req.body.genre
		});
		if (!errors.isEmpty()) {
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err)
					return next(err);
                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, 
					genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else
		{
            book.save(function (err) {
                if (err) { return next(err); }
                   res.redirect(book.url);
            });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
	async.parallel({
        book: function(callback) {
            Book.findById(req.params.id)
			.populate('author')
			.populate('genre')
			.exec(callback);
        },
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
	}, function(err, results) {
		if (err)
			return next(err);
		if (results.book == null) {
			var err = new Error('Book not found');
			err.status = 404;
			return next(err);
		}
		for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
			for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
				if (results.genres[all_g_iter]._id.toString() === results.book.genre[book_g_iter]._id.toString()) {
					results.genres[all_g_iter].checked='true';
				}
			}
		}
		res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
	});
};

// Handle book update on POST.
exports.book_update_post = [

    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },
   
    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id // This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err)
					return next(err);
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(thebook.url);
            });
        }
    }
];
