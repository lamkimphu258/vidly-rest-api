const express = require('express')
const router = express.Router()

const {Customer, validate} = require('../models/customer')

router.get("/", async (req, res) => {
    const customers = await Customer.find()

    res.send(customers)
})

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer)
        return res.status(404).send("Cannot found customer with given ID")

    res.send(customer)
})

router.post("/", async (req, res) => {
    const {error} = validate(req.body)
    if (error)
        return res.status(400).send(error.details[0].message)

    const newCustomer = new Customer(req.body)
    await newCustomer.save()

    res.send(newCustomer)
})

router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer)
        return res.status(404).send("Cannot found customer with given ID")

    res.send(customer)
})

router.put("/:id", async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!customer) return res.status(404).send("Cannot found customer with given ID")

    res.send(customer)
})

module.exports = router