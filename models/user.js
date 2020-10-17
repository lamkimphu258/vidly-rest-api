const mongoose = require('mongoose')
const Joi = require('joi')
const passwordComplexity = require("joi-password-complexity");
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        min:5,
        max:255,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        min: 8,
        max: 26,
        required: true
    }
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id}, config.get('jwtPrivateKey'))
    return token
}

const User = mongoose.model('User', userSchema)

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().required().email(),
        password: passwordComplexity(),
    })

    return schema.validate(user)
}

exports.User = User
exports.validate = validateUser