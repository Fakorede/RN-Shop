function errorHandler (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({error: 'User is not authorized!'})
  }

  if (err.name === 'ValidationError') {
    return res.status(401).json({error: err})
  }

  return res.status(500).json({error: err})
}

module.exports = errorHandler
