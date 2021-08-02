const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')

const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const authJwt = require('./middlewares/authMiddleware')
const errorHandler = require('./middlewares/errorMiddleware')

dotenv.config()
connectDB()
const app = express()

// middlewares
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler)

const api = process.env.API_URL

app.use(`${api}/users`, userRoutes)
app.use(`${api}/categories`, categoryRoutes)
app.use(`${api}/products`, productRoutes)
app.use(`${api}/orders`, orderRoutes)

const PORT = process.env.PORT || 4500

app.listen(PORT, () => console.log(`Server is listening on Port ${PORT}`))
