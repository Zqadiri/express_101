var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bookInstanceSchema = new Schema({
    book: { type: Schema.ObjectId, ref: 'Book', required: true }, // Reference to the associated book.
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum:['Available', 'Maintenance', 'Loaned', 'Reserved'], default:'Maintenance'},
    due_back: { type: Date, default: Date.now },
});

var bookInstanceModel = mongoose.model('Book', bookInstanceSchema);