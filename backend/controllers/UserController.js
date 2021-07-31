const User = require('../models/User')
const generateToken = require('../utils/generateToken.js')

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    return res.json({
      users,
      success: true
    })
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      return res.status(404).json({
        message:  'User with given ID was not found!',
        success: false
      })
    }

    return res.json({
      user,
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body
    
  const user = await User.findOne({ email })

  if(user && (await user.matchPasswords(password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id, user.isAdmin)
    })
  } else {
    res.status(401).json({error: 'Invalid Credentials!'})
  }
}

exports.registerUser = async (req, res) => {
  try {
    const { email } = req.body

    const userExists = await User.findOne({email})

    if(userExists) {
      res.status(400).json({error: 'User already exists!'})
    }

    const user = await User.create(req.body)

    return res.status(201).json({
      user,
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}

exports.getAuthUser = async (req, res) => {
  const user = await User.findById(req.user.id)

  if(user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404).json({error: 'User not found!'})
  }
}

exports.getUserStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments((count) => count)
    return res.json({ userCount })
  } catch (err) {
    return res.status(500).json({
      error: err,
      success: false
    })
  }
}
