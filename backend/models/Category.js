const mongoose = require('mongoose')
const { Schema } = mongoose

const categorySchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String },
  color: { type: String }
})

categorySchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject()
  const { _id:id, ...result } = object
  return { id,...result }
})

module.exports = mongoose.model('Category', categorySchema)
