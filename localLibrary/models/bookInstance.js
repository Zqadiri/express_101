var mongoose = require('mongoose');

/*
    luxon, a powerful, modern, and friendly library for parsing, validating,
    manipulating, formatting and localising dates.
*/

const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var bookInstanceSchema = new Schema({
    book: { type: Schema.ObjectId, ref: 'Book', required: true }, // Reference to the associated book.
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum:['Available', 'Maintenance', 'Loaned', 'Reserved'], default:'Maintenance'},
    due_back: { type: Date, default: Date.now },
});

bookInstanceSchema.virtual('url').get(function(){
    return '/catalog/bookinstance/' + this._id;
});

bookInstanceSchema.virtual('due_back_formatted').get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('BookInstance', bookInstanceSchema);
