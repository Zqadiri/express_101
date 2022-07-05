var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');

/* GET home page. */
router.get('/', user_controller.index);

// Sign up new users
router.get('/sign-up', user_controller.sign_up_form_get);
router.post('/sign-up', user_controller.sign_up_form_post);

// log in into the club house
router.get('/log-in', user_controller.log_in_form_get);
router.post('/log-in', user_controller.log_in_form_post);


module.exports = router;
