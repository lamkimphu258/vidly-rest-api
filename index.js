const express = require('express')
require('express-async-error')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const morgan = require('morgan')
const winston = require('./config/winston')

const app = express()
app.use(morgan('combined', {stream: winston.stream}))

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

require('./startup/db')()
require('./startup/routes')(app)
require('./startup/config')()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}...`))