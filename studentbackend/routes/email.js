'use strict'
var express = require('express');
var EmailController = require('../controllers/email');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/books' });



router.post('/send', EmailController.send);


module.exports = router;