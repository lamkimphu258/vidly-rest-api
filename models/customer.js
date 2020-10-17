const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model("Customer", new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        min: [5, "Name length must greater than 5 characters"],
        max: [50, "Name length must less than 50 characters"],
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        min: [10, "Invalid phone number"],
        max: [10, "Invalid phone number"],
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    }
}))

const validateCustomer = (customer) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(10).max(10).required(),
        isGold: Joi.bool().default(false)
    })

    return schema.validate(customer)
}

exports.Customer = Customer
exports.validate = validateCustomer