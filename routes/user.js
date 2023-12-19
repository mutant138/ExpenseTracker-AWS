const express = require('express')

const userController = require('../controller/user')
const authenticationmiddleware = require('../middleware/auth')
const expenseController = require('../controller/expense')


const router = express.Router()
router.get('/',userController.signupPage)
router.post('/signup', userController.signup)
router.get('/login',userController.loginPage)
router.post('/login',userController.login)
router.get('/download', authenticationmiddleware.authenticate,expenseController.downloadExpenses)


module.exports = router;