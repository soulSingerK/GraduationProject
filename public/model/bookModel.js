/**
 * Created by dreamIt on 2017/4/23.
 */
var mongoose = require('./mongoose');
var BookModel = new mongoose.Schema({
    bookId: Number,
    bookName: String,
    author: String,
    publish: String,
    price: Number,
    introduce: String,
    bookKind: String,
    bookImg: String,
    time: Number,
    stock: Number,
    borrowCount: {type: Number,default: 0}
})

var book = mongoose.model('Book',BookModel);
module.exports = book;