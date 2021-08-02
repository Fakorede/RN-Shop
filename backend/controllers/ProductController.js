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

    // image upload
    const file = req.file;
    if (!file) return res.status(400).json('Product image not uploaded!')
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
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
    if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({error: 'Product ID is invalid'})

    const category = await Category.findById(req.body.category)
    if (!category) return res.status(404).send('Category does not exist!')

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    // update image
    const file = req.file;
    let imagepath;

    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      imagepath = `${basePath}${fileName}`;
    } else {
      imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagepath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    }, { new: true })

    if (!updatedProduct) {
      return res.status(500).json({
        message: 'Product cannot be updated!',
        success: false
      })
    }

    return res.status(200).json({
      message: 'Product updated successfully!',
      updatedProduct,
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
  } catch (err) {
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
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.uploadGalleryImages = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id')
  }

  const files = req.files
  let imagePaths = []
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

  if (files) {
    files.map((file) => {
      imagePaths.push(`${basePath}${file.filename}`)
    })
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagePaths,
    },
    { new: true }
  )

  if (!product)
    return res.status(500).send('the gallery cannot be updated!')

  res.send(product)
}
