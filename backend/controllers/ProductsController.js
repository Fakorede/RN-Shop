const Product = require('../models/Product')

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json({
      products,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock
    })

    const newProduct = await product.save()
    res.status(201).json({
      newProduct,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false
    })
  }
}
