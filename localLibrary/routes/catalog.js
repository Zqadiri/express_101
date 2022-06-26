var express = require('express');
var router =  express.Router();

router.get('/', function(req, res) {
});

// ? books -----------

router.get('/books', function(req, res){
});

router.get('/book/:id', function(req, res){
});

// Display the create form on GET.
router.get('/book/create', function(req, res){
});

router.post('/book/create', function(req, res){
});

router.put('/book/:id/update', function(req, res) {
});

router.delete('/book/:id/delete', function(req, res) {
});

// Display delete form on GET.
router.get('/book/:id/delete', function(req, res){
});

// Display update form on GET.
router.get('/book/:id/update', function(req, res){
});

// ? bookInstances -----------


router.get('/bookInstances', function(req, res){
});

router.get('/bookInstance/:id', function(req, res){
});

router.get('/bookInstance/create', function(req, res){
});

router.post('/bookInstance/create', function(req, res){
});

router.get('/bookInstance/:id/update', function(req, res){
});

router.put('/bookInstance/:id/update', function(req, res) {
});

router.get('/bookInstance/:id/delete', function(req, res){
});

router.delete('/bookInstance/:id/delete', function(req, res) {
});

// ? genres -----------

router.get('/genres', function(req, res){
});

router.get('/genre/:id', function(req, res){
});

router.get('/genre/create', function(req, res){
});

router.post('/genre/create', function(req, res){
});

router.put('/genre/:id/update', function(req, res) {
});

router.delete('/genre/:id/delete', function(req, res) {
});

router.get('/genre/:id/delete', function(req, res){
});

router.get('/genre/:id/update', function(req, res){
});

// ? authors -----------

router.get('/authors', function(req, res){
});

router.get('/author/:id', function(req, res){
});

router.get('author/create', function(req, res){
});

router.post('author/create', function(req, res){
});

router.put('/author/:id/update', function(req, res) {
});

router.delete('/author/:id/delete', function(req, res) {
});

router.get('/author/:id/delete', function(req, res){
});

router.get('/author/:id/update', function(req, res){
});

//Export Router
module.exports = router;
