var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user')

router.post('/signup',UserController.CreateUser)

router.post('/login',UserController.UserLogin)

module.exports = router;