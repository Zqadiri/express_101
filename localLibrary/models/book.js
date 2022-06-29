/*
  TODO: Models
  Models are defined using the Schema interface. 
  The Schema allows you to define the fields stored in each 
  document along with their validation requirements and default
  values.
*/

var mongoose = require('mongoose');

// define a schema
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: {type: String, required: true},
    author: { type: Schema.ObjectId, ref: 'Author', required: true },
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    // from one document to many using an array of ObjectIds
    genre: [{ type: Schema.ObjectId, ref: 'Genre' }]
});

/*
  Virtual properties are document properties that you can get and 
  set but that do not get persisted to MongoDB.
*/

bookSchema.virtual('url').get(function(){
  return '/catalog/book/' + this._id;
});

// Compile a model from schema -   An instance of a model is called a document
module.exports = mongoose.model('Book', bookSchema);

//! Mongoose provides built-in and custom validators includes: required validator, 
//! min and max for numbers, ....
