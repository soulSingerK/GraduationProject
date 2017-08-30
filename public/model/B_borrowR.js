/**
 * Created by dreamIt on 2017/5/16.
 */
var mongoose = require('mongoose');
var B_borrowModel = new mongoose.Schema({
    studentId: Number,
    bookName: String,
    borrowCount: Number,
    borrowTime: Number,
    B_id: Number
})

var admin = mongoose.model('B_borrow',B_borrowModel);

module.exports = admin;