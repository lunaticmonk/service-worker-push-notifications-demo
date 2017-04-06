var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userschema = new Schema({
	endpoint : { type : String, required : true 
}});

var User = mongoose.model('User', userschema);

module.exports = User;