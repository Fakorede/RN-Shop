const express = require('express')
const Router = express.Router()

const { 
  getCategories, 
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/CategoryController')


Router
  .route('/')
  .get(getCategories)
  .post(createCategory)

Router
  .route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory)

module.exports = Router
