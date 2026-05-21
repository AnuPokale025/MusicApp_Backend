const LoginController = require('../auth/LoginController');
const RegisterController = require('../auth/RegisterController');
const express = require('express');
const router = express.Router();


///Auth routes
router.post('/register', RegisterController.register);
router.post('/login', LoginController.login);

module.exports = router;