var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    email: {type: String},
    password: {type: String, minLength: 10, maxLength: 100},
});

module.exports = mongoose.model('User', userSchema);