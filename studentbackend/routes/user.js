'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

// Rutas de prueba
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

// Rutas de usuarios
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/user/update', md_auth.authenticated, UserController.update);
router.post('/upload-avatar', [md_auth.authenticated, md_upload], UserController.uploadAvatar);
router.get('/avatar/:fileName', UserController.avatar);
router.get('/books/:page?', UserController.getBooks);
router.get('/book/:bookId', UserController.getBook);

module.exports = router;
