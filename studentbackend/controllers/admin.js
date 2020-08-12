'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var Book = require('../models/book');
var User = require('../models/user');
var jwt = require('../services/jwt');

var controller = {

	probando: function(req, res){
		return res.status(200).send({
			message: "Soy el metodo probando"
		});
	},

	testeando: function(req, res){
		return res.status(200).send({
			message: "Soy el metodo TESTEANDO"
		});
	},

	save: function(req, res){
		// Recoger los parametros de la petición

		var params = req.body;

		// Validar los datos
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_description = !validator.isEmpty(params.description);
			var validate_author= !validator.isEmpty(params.author);
			var validate_price = !validator.isEmpty(params.price);
      var validate_stock = !validator.isEmpty(params.stock);
			//console.log(validate_name, validate_surname, validate_email, validate_password);
		}catch(err){
			return res.status(200).send({
								message: "Faltan datos por enviar del libro"
							});
		}

		if(validate_title && validate_description && validate_author && validate_price && validate_stock){
			// Crear objeto de usuario
			var book = new Book();


			// Conseguir el nombre y la extension del archivo
			  var file_path = params.image;
    //  var file_path = req.;
			var file_split = file_path.split('\\');

			// ** Adventencia ** En linux o mac
		//	var file_split = file_path.split('/');

			// Nombre del archivo
			var file_name = file_split[2];

			// Extensión del archivo
			var ext_split = file_name.split('\.');
			var file_ext = ext_split[1];

			// Comprobar extension (solo imagenes), si no es valida borrar fichero subido
			if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
				fs.unlink(file_path, (err) => {

					return res.status(200).send({
						status: 'error',
						message: 'La extensión del archivo no es valida.'
					});

				});

			}

			// Asignar valores al objeto
			book.title = params.title;
			book.description = params.description;
			book.author = params.author;
			book.price = params.price;
			book.image = file_name;
      book.stock = params.stock;


			// Comprobar si el usuario existe
			Book.findOne({title: book.title}, (err, issetBook) => {
				if(err){
					return res.status(500).send({
						message: "Error al comprobar duplicidad del libro"
					});
				}

				if(!issetBook){


						//y guardar libro
						book.save((err, bookStored) => {
							if(err){
								return res.status(500).send({
									message: "Error al guardar el libro"
								});
							}

							if(!bookStored){
								return res.status(400).send({
									message: "El libro no se ha guardado"
								});
							}

							// Devolver respuesta
							return res.status(200).send({
								status: 'success',
								book: bookStored
							});

						}); // close save


				}else{
					return res.status(200).send({
						message: "El libro ya está registrado"
					});
				}

			});


		}else{
			return res.status(200).send({
				message: "Validación de los datos del libro incorrecta, intentalo de nuevo"
			});
		}

	},




	saveadmin: function(req, res){
		// Recoger los parametros de la petición
		var params = req.body;

		// Validar los datos
		try{
			var validate_name = !validator.isEmpty(params.name);
			var validate_surname = !validator.isEmpty(params.surname);
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
			//console.log(validate_name, validate_surname, validate_email, validate_password);
		}catch(err){
			return res.status(200).send({
								message: "Faltan datos por enviar"
							});
		}

		if(validate_name && validate_surname && validate_password && validate_email){
			// Crear objeto de usuario
			var user = new User();

			// Asignar valores al objeto
			user.name = params.name;
			user.surname = params.surname;
			user.email = params.email.toLowerCase();
			user.role = 'ROLE_ADMIN';
			user.image = null;

			// Comprobar si el usuario existe
			User.findOne({email: user.email}, (err, issetUser) => {
				if(err){
					return res.status(500).send({
						message: "Error al comprobar duplicidad de usuario"
					});
				}

				if(!issetUser){
					// Si no exite,

					//cifrar la contraseña
					bcrypt.hash(params.password, null, null, (err, hash) => {
						user.password = hash;

						//y guardar usuario
						user.save((err, userStored) => {
							if(err){
								return res.status(500).send({
									message: "Error al guardar el usuario"
								});
							}

							if(!userStored){
								return res.status(400).send({
									message: "El usuario no se ha guardado"
								});
							}

							// Devolver respuesta
							return res.status(200).send({
								status: 'success',
								user: userStored
							});

						}); // close save
					}); // close bcrypt

				}else{
					return res.status(200).send({
						message: "El usuario ya está registrado"
					});
				}

			});


		}else{
			return res.status(200).send({
				message: "Validación de los datos del usuario incorrecta, intentalo de nuevo"
			});
		}

	},


	login: function(req, res){
		// Recoger los parametros de la petición
		var params = req.body;

		// Validar los datos
		try{
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		}catch(err){
			return res.status(200).send({
								message: "Faltan datos por enviar"
							});
		}

		if(!validate_email || !validate_password){
			return res.status(200).send({
						message: "Los datos son incorrectos, envialos bien"
					});
		}

		// Buscar usuarios que coincidan con el email
		User.findOne({email: params.email.toLowerCase()}, (err, user) => {

			if(err){
				return res.status(500).send({
					message: "Error al intentar identificarse"
				});
			}

			if(!user){
				return res.status(404).send({
					message: "El usuario no existe"
				});
			}

			// Si lo encuentra,
			// Comprobar la contraseña (coincidencia de email y password / bcrypt)
			bcrypt.compare(params.password, user.password, (err, check) => {

				// Si es correcto,
				if(check){

					// Generar token de jwt y devolverlo
					if(params.gettoken){

						// Devolver los datos
						return res.status(200).send({
							token: jwt.createToken(user)
						});

					}else{

						// Limpiar el objeto
						user.password = undefined;

						// Devolver los datos
						return res.status(200).send({
							status: "success",
							user
						});

					}

				}else{
					return res.status(200).send({
						message: "Las credenciales no son correctas"
					});
				}

			});

		});
	},

	update: function(req, res){
		// Recoger datos del usuario
		var params = req.body;

		// Validar datos
		try{
      var validate_title = !validator.isEmpty(params.title);
      var validate_description = !validator.isEmpty(params.description);
      var validate_author= !validator.isEmpty(params.author);
      var validate_price = !validator.isEmpty(params.price);
      var validate_stock = !validator.isEmpty(params.stock);
		}catch(err){
			return res.status(200).send({
								message: "Faltan datos por enviar"
							});
		}

		// Eliminar propiedades innecesarias
		//delete params.password;

		//var bookId = req.book.sub;
    	var bookId = req.params.bookId;
		//console.log(userId)

		// Comprobar si el email es unico
		// if(req.user.email != params.email){
    //
		// 	User.findOne({email: params.email.toLowerCase()}, (err, user) => {
    //
		// 		if(err){
		// 			return res.status(500).send({
		// 				message: "Error al intentar identificarse"
		// 			});
		// 		}
    //
		// 		if(user && user.email == params.email){
		// 			return res.status(200).send({
		// 				message: "El email no puede ser modificado"
		// 			});
		// 		}else{
		// 			// Buscar y actualizar documento
		// 			Book.findOneAndUpdate({_id: userId}, params, {new:true}, (err, bookUpdated) => {
    //
		// 				if(err){
		// 					return res.status(500).send({
		// 						status: 'error',
		// 						message: 'Error al actualizar libro'
		// 					});
		// 				}
    //
		// 				if(!userUpdated){
		// 					return res.status(200).send({
		// 						status: 'error',
		// 						message: 'No se a actualizado el libro'
		// 					});
		// 				}
    //
		// 				// Devolver respuesta
		// 				return res.status(200).send({
		// 						status: 'success',
		// 						user: bookUpdated
		// 					});
    //
		// 			});
		// 		}
    //
		// 	});
    //
		// }else{

			// Buscar y actualizar documento
			Book.findOneAndUpdate({_id: bookId}, params, {new:true}, (err, bookUpdated) => {

				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error al actualizar libro'
					});
				}

				if(!bookUpdated){
					return res.status(200).send({
						status: 'error',
						message: 'No se a actualizado el libro'
					});
				}

				// Devolver respuesta
				return res.status(200).send({
						status: 'success',
						user: bookUpdated
					});

			});
	//	}

	},

	uploadAvatar: function(req, res){
		// Configurar el modulo multiparty (md) routes/user.js

		// Recoger el fichero de la petición
		 var file_name = 'imagen no subida...';


		if(!req.files){
			return res.status(404).send({
					status: 'error',
					message: file_name
			});
		}

		// Conseguir el nombre y la extension del archivo
		var file_path = req.params.file0.path;
	//	var file_split = file_path.split('\\');

		// ** Adventencia ** En linux o mac
	 	var file_split = file_path.split('/');

		// Nombre del archivo
		var file_name = file_split[2];

		// Extensión del archivo
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		// Comprobar extension (solo imagenes), si no es valida borrar fichero subido
		if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
			fs.unlink(file_path, (err) => {

				return res.status(200).send({
					status: 'error',
					message: 'La extensión del archivo no es valida.'
				});

			});

		}else{
			// Sacar el id del libro
      var params = req.body;
			var bookId = req.params.bookId;

			// Buscar y actualizar documento bd
			Book.findOneAndUpdate({_id: bookId}, {image: file_name}, {new:true}, (err, bookUpdated) => {

				if(err || !bookUpdated){
					// Devolver respuesta
					return res.status(500).send({
							status: 'error',
							message: 'Error al guardar la imagen'
						});
				}

				// Devolver respuesta
				return res.status(200).send({
						status: 'success',
						image: book.image,
						user: bookUpdated
					});

			});
 }
	},

	avatar: function(req, res){
		var fileName = req.params.fileName;
		var pathFile = './uploads/books/'+fileName;

		fs.exists(pathFile, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(pathFile));
			}else{
				return res.status(404).send({
					message: 'La imagen no existe'
				});
			}
		});
	},

	getBooks: function(req, res){

		// Recoger la pagina actual
		if(!req.params.page || req.params.page == 0 || req.params.page == "0" || req.params.page == null || req.params.page == undefined){
			var page = 1;
		}else{
			var page = parseInt(req.params.page);
		}

		// Indicar las opciones de paginacion
		var options = {
			sort: { date: -1 },
			populate: 'book',
			limit: 5,
			page: page
		};

		// Find paginado
		Book.paginate({}, options, (err, books) => {

			if(err){
				return res.status(500).send({
								status: 'error',
								message: 'Error al hacer la consulta'
							});
			}

			if(!books){
				return res.status(404).send({
								status: 'error',
								message: 'No hay libros'
							});
			}

			// Devoler resultado (topics, total de topic, total de paginas)
			return res.status(200).send({
				status: 'success',
				books: books.docs,
				totalDocs: books.totalDocs,
				totalPages: books.totalPages
			});

		});

	},

	getBook: function(req, res){
		var bookId = req.params.bookId;

		Book.findById(bookId).exec((err, book) => {
			if(err || !book){
				return res.status(404).send({
					status: 'error',
					message: 'No existe el libro'
				});
			}

			return res.status(200).send({
				status: 'success',
				book
			});
		});
	},
	search: function(req, res){

		// Sacar string a buscar de la url
		var searchString = req.params.search;

		// Find or
		Book.find({ "$or": [
			{ "title": { "$regex": searchString, "$options": "i"} },
			{ "author": { "$regex": searchString, "$options": "i"} }

		]})
		.populate('book')
		.sort([['date', 'descending']])
		.exec((err, books) => {

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error en la petición'
				});
			}

			if(!books){
				return res.status(404).send({
					status: 'error',
					message: 'No hay temas disponibles'
				});
			}

			return res.status(200).send({
				status: 'success',
				books
			});

		});
	}

};

module.exports = controller;
