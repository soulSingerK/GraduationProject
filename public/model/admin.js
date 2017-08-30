var mongoose = require('mongoose');
var AdminModel = new mongoose.Schema({
    name: String,
    password: String,
    userId: Number
})

var admin = mongoose.model('Admin',AdminModel);

module.exports = admin;