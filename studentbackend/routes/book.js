'use strict'

var express = require('express');
var AdminController = require('../controllers/admin');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/books' });

// Rutas de prueba
//router.get('/probando', UserController.probando);
router.post('/testeando', AdminController.testeando);

// Rutas de usuarios
router.post('/save', md_upload, AdminController.save);
router.post('/saveadmin', AdminController.saveadmin);
router.post('/login', AdminController.login);
router.put('/update/:bookId', AdminController.update);
router.put('/update', md_auth.authenticated, AdminController.update);
//router.post('/upload-avatar/:bookId', md_upload, AdminController.uploadAvatar);
router.post('/upload-avatar', md_upload, AdminController.uploadAvatar);
//router.post('/upload-avatar', [md_auth.authenticated, md_upload], AdminController.uploadAvatar);
router.get('/avatar/:fileName', AdminController.avatar);
router.get('/books/:page', AdminController.getBooks);
//router.get('/books/', AdminController.getBooks);
router.get('/book/:bookId', AdminController.getBook);
router.get('/search/:search', AdminController.search);
module.exports = router;
