var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var authorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
});

var authorModel = mongoose.model('Author', authorSchema);

