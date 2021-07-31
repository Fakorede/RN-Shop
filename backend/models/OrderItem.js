const mongoose = require('mongoose')
const { Schema } = mongoose

const orderItemSchema = new Schema({
  quantity: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
})

orderItemSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject()
  const { _id:id, ...result } = object
  return { id,...result }
})

module.exports = mongoose.model('OrderItem', orderItemSchema)
