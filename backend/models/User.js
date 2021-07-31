const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema } = mongoose

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  street: { type: String, default: '' },
  apartment: { type: String, default: '' },
  zip: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
})

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPasswords = async function(password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject()
  const { _id:id, ...result } = object
  return { id,...result }
})

module.exports = mongoose.model('User', userSchema)
