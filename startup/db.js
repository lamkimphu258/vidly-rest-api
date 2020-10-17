const mongoose = require('mongoose')

module.exports = () => {
    mongoose.connect('mongodb://localhost:27017/vidly', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
    }).then(() => console.log("Connected to vidly database")).catch(err => console.error('Cannot connect to database'));
}