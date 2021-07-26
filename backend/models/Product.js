const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, defaut: '' },
  images: [{ type: String }],
  brand: { type: String, default: '' },
  price: { type: String, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  countInStock: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now }
})

productSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject()
  const { _id:id, ...result } = object
  return { id,...result }
})

module.exports = mongoose.model("Product", productSchema)
