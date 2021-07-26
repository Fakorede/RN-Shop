const Category = require('../models/Category')

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    return res.json({
      categories,
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        message: 'Category with given ID was not found!',
        success: false
      })
    }

    return res.json({
      category,
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.createCategory = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color
    })

    const newCategory = await category.save()
    return res.status(201).json({
      newCategory,
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
    }, { new: true })

    if (!category) {
      return res.status(404).json({
        message: 'Category with given ID was not found!',
        success: false
      })
    }

    return res.status(200).json({
      message: 'Category updated successfully!',
      category,
      success: true 
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        message: 'Category with given ID was not found!',
        success: false
      })
    }

    await category.delete()

    return res.status(200).json({
      message: 'Category deleted successfully!',
      success: true 
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}
