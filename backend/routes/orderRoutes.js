const express = require('express')
const Router = express.Router()

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getTotalSales,
  getCount,
  getUserOrders
} = require('../controllers/OrderController')

Router
  .route('/')
  .get(getOrders)
  .post(createOrder)

Router
  .route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(deleteOrder)

Router.get('/get/totalsales', getTotalSales)
Router.get('/get/count', getCount)
Router.get('/get/userorders/:userid', getUserOrders)

module.exports = Router
