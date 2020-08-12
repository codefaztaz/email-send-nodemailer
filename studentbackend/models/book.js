'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var BookSchema = Schema({
	title: String,
	description: String,
	author: String,
	image: String,
	stock: Number,
  price: Number,
  date: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: 'User'}
});

// UserSchema.methods.toJSON = function(){
// 	var obj = this.toObject();
// 	delete obj.password;
//
// 	return obj;
// }
BookSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Book', BookSchema);
                               // lowercase y pluralizar el nombre
                               // users  -> documentos(schema)
