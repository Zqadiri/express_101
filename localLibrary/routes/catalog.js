var express = require('express');
var router =  express.Router();

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');

router.get('/', book_controller.index);

// ? books -----------

router.get('/books', book_controller.book_list);

router.get('/book/create', book_controller.book_create_get);

router.post('/book/create', book_controller.book_create_post);

// Display the create form on GET.
router.get('/book/:id', book_controller.book_detail);

// Display delete form on GET.
router.get('/book/:id/delete', book_controller.book_delete_get);

router.post('/book/:id/delete', book_controller.book_delete_post);

// Display update form on GET.
router.get('/book/:id/update', book_controller.book_update_get);

router.post('/book/:id/update', book_controller.book_update_post);

// ? bookInstances -----------

router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

router.get('/bookinstances', book_instance_controller.bookinstance_list);

// ? genres -----------

router.get('/genre/create', genre_controller.genre_create_get);

router.post('/genre/create', genre_controller.genre_create_post);

router.get('/genre/:id/delete', genre_controller.genre_delete_get);

router.post('/genre/:id/delete', genre_controller.genre_delete_post);

router.get('/genre/:id/update', genre_controller.genre_update_get);

router.post('/genre/:id/update', genre_controller.genre_update_post);

router.get('/genre/:id', genre_controller.genre_detail);

router.get('/genres', genre_controller.genre_list);

// ? authors -----------

router.get('/authors', author_controller.author_list);

router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

router.get('/author/:id', author_controller.author_detail);

router.get('/author/:id/update', author_controller.author_update_get);

router.post('/author/:id/update', author_controller.author_update_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);


//Export Router
module.exports = router;
