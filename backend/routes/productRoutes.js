const express = require('express')
const Router = express.Router()
const multer = require('multer')

const { 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getFeaturedProducts,
  uploadGalleryImages
} = require('../controllers/ProductController')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

// image upload middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type')

    if (isValid) {
      uploadError = null
    }

    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  },
})

const uploadOptions = multer({ storage: storage })

Router
  .route('/')
  .get(getProducts)
  .post(uploadOptions.single('image'), createProduct)

Router
  .route('/:id')
  .get(getProductById)
  .put(uploadOptions.single('image'), updateProduct)
  .delete(deleteProduct)

Router
  .route('/get/stats')
  .get(getProductStats)

Router
  .route('/featured/:count')
  .get(getFeaturedProducts)

Router.put('/gallery-images/:id', uploadOptions.array('images', 10), uploadGalleryImages)

module.exports = Router
