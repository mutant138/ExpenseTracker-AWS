const express = require('express')

const userController = require('../controller/user')


const router = express.Router()
router.get('/signup',userController.signupPage)
router.post('/signup', userController.signup)
router.get('/login',userController.loginPage)
router.post('/login',userController.login)


module.exports = router;