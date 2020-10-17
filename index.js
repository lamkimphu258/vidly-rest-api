const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const config = require('config')

const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const authentication = require('./routes/authentication')

const app = express()

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.')
    process.exit(1)
}

mongoose.connect('mongodb://localhost:27017/vidly', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    createIndexes: true
}).then(() => console.log("Connected to vidly database")).catch(() => console.error("Cannot connect to vidly database."));

app.use(express.json())

app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/authentication', authentication)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}`))