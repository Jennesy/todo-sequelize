const express = require("express")
const router = express.Router()
const authenticator = require('../middleware/auth')
const todos = require('./modules/todos')
const users = require('./modules/users')
const home = require('./modules/home')

router.use('/todos', authenticator, todos)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router