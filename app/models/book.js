var mongoose = require('mongoose');

//Book Schema
var bookSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    author: String, 
    publisher: String,
    image: String,
    isbn: String,
    pages: Number,
    quantity: Number,
    modified_date: Date
});

module.exports = mongoose.model('Book', bookSchema);