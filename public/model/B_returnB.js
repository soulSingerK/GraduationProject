/**
 * Created by dreamIt on 2017/5/16.
 */
var mongoose = require('mongoose');
var B_returnModel = new mongoose.Schema({
    studentId: Number,
    bookName: String,
    returnCount: Number,
    returnTime: Number,
    B_id: Number
})

var admin = mongoose.model('B_return',B_returnModel);

module.exports = admin;