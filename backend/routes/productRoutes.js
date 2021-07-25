const express = require('express')
const Router = express.Router()

const { 
  getProducts, 
  createProduct 
} = require('../controllers/ProductsController')


Router
  .route('/')
  .get(getProducts)
  .post(createProduct)

module.exports = Router
