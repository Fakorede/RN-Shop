const express = require('express')
const Router = express.Router()

const { 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getFeaturedProducts
} = require('../controllers/ProductController')


Router
  .route('/')
  .get(getProducts)
  .post(createProduct)

Router
  .route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct)

Router
  .route('/get/stats')
  .get(getProductStats)

Router
  .route('/featured/:count')
  .get(getFeaturedProducts)

module.exports = Router
