const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
  name: String,
  image: String,
  countInStock: { type: Number, required: true },
})

module.exports = mongoose.model("Product", productSchema)
