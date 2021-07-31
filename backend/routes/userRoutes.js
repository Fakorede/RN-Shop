const express = require('express')
const Router = express.Router()

const { 
  getUser,
  getUsers,
  loginUser,
  registerUser,
  getAuthUser,
  getUserStats,
} = require('../controllers/UserController')

Router
  .route('/')
  .get(getUsers)

Router
  .route('/:id')
  .get(getUser)

Router.get('/auth', getAuthUser)
Router.post('/register', registerUser)
Router.post('/login', loginUser)

Router.get('/get/stats', getUserStats)

module.exports = Router
