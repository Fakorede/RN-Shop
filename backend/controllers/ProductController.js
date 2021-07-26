const mongoose = require('mongoose')
const Product = require('../models/Product')
const Category = require('../models/Category')

exports.getProducts = async (req, res) => {
  try {
    const filter = req.query.categories ? {category: req.query.categories.split(',')} : {}
    const products = await Product.find(filter).populate('category')
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

exports.getProductById = async (req, res) => {
  try {
    if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Product ID is invalid')

    const product = await Product.findById(req.params.id).populate('category')

    if (!product) {
      return res.status(404).json({
        message: 'Product with given ID was not found!',
        success: false
      })
    }

    return res.json({
      product,
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.createProduct = async (req, res) => {
  try {
    if(!mongoose.isValidObjectId(req.body.category)) return res.status(400).json({ error: 'Category ID is invalid' })

    const category = await Category.findById(req.body.category)
    if (!category) return res.status(404).json({ error: 'Category does not exist!' })

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
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


exports.updateProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(404).send('Category does not exist!')

    if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({error: 'Product ID is invalid'})

    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    }, { new: true })

    if (!product) {
      return res.status(404).json({
        message: 'Product with given ID was not found!',
        success: false
      })
    }

    return res.status(200).json({
      message: 'Product updated successfully!',
      product,
      success: true 
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Product ID is invalid' })

    const product = await Product.findByIdAndRemove(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: 'Product with given ID was not found!',
        success: false
      })
    }

    return res.status(200).json({
      message: 'Product deleted successfully!',
      success: true 
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.getProductStats = async (req, res) => {
  try {
    const productCount = await Product.countDocuments((count) => count)
    return res.json({ productCount })
  } catch (error) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.getFeaturedProducts = async (req, res) => {
  try {
    const count = req.params.count ?? 0
    const featured = await Product.find({ isFeatured: true }).limit(+count)
    return res.json({ featured })
  } catch (error) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}
