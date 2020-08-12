'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmailSchema = Schema({
	name: String,
	email: String,
	message: String,
});

// UserSchema.methods.toJSON = function(){
// 	var obj = this.toObject();
// 	delete obj.password;
//
// 	return obj;
// }

module.exports = mongoose.model('Email', EmailSchema);