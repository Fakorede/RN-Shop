const jwt = require('jsonwebtoken')

function generateToken (id, isAdmin) {
  return jwt.sign({id, isAdmin}, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })
}

module.exports = generateToken
