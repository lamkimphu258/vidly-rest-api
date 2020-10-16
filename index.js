// import express from 'express'
// import genres from './routes/genres.js'
//
// import mongoose from "mongoose";

const express = require('express')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost:27017/vidly', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(() => console.log("Connected to vidly database")).catch(() => console.error("Cannot connect to vidly database."));

app.use(express.json())

app.use('/api/genres', genres)
app.use('/api/customers', customers)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}`))