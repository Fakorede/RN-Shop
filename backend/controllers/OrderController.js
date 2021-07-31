const mongoose = require('mongoose')
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')

exports.getOrders = async (req, res) => {
  const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1})

  if(!orderList) {
    res.status(500).json({success: false})
  } 
  
  res.json(orderList)
}

exports.getOrderById = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).json({message: "Invalid Order ID!"})
  }

  const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
      path: 'orderItems', populate: {
      path : 'product', populate: 'category'} 
    })

  if(!order) {
    res.status(500).json({success: false})
  } 

  res.json(order)
}

exports.createOrder = async (req, res) => {
  const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })

    newOrderItem = await newOrderItem.save()

    return newOrderItem._id
  }))

  const orderItemsIdsResolved =  await orderItemsIds

  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
    const totalPrice = orderItem.product.price * orderItem.quantity
    return totalPrice
  }))

  const totalPrice = totalPrices.reduce((a,b) => a +b , 0)

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  })

  order = await order.save()

  if(!order) return res.status(400).json('The order cannot be created!')

  res.json(order)
}

exports.updateOrderStatus = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).json({message: "Invalid Order ID!"})
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status
    },
    { new: true}
  )

  if(!order) return res.status(400).json('Order cannot be updated!')
  res.json(order);
}

exports.deleteOrder = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).json({message: "Invalid Order ID!"})
  }

  Order.findByIdAndRemove(req.params.id).then(async order => {
    if(order) {
      await order.orderItems.map(async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem)
      })
      return res.status(200).json({success: true, message: 'Order has been deleted!'})
    } else {
      return res.status(404).json({success: false , message: "Order not found!"})
    }
  }).catch(err => {
    return res.status(500).json({success: false, error: err}) 
  })
}

exports.getTotalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null , totalSales : { $sum : '$totalPrice'}}}
  ])

  if(!totalSales) {
    return res.status(400).json('The Order sales cannot be generated')
  }

  res.json({totalSales: totalSales.pop().totalSales})
}

exports.getCount = async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count)

  if(!orderCount) {
    res.status(500).json({success: false})
  }

  res.json({ orderCount })
}

exports.getUserOrders = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.userid)){
    res.status(400).json({message: "Invalid User ID!"})
  }

  const userOrderList = await Order.find({user: req.params.userid}).populate({ 
    path: 'orderItems', populate: {
      path : 'product', populate: 'category'} 
    }).sort({'dateOrdered': -1});

  if(!userOrderList) {
    res.status(500).json({success: false})
  } 

  res.json(userOrderList);
}
