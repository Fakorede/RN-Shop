const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')

const connectDB = require('./config/db')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')

dotenv.config()
connectDB()
const app = express()

// middlewares
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(morgan('tiny'))

const api = process.env.API_URL

app.use(`${api}/categories`, categoryRoutes)
app.use(`${api}/products`, productRoutes)

const PORT = process.env.PORT || 4500

app.listen(PORT, () => console.log(`Server is listening on Port ${PORT}`))
