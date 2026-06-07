const mongoose = require('mongoose');

/// Person Schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,
    },
    work: {
        type: String,
        enum: ['Chef', 'Waiter', 'Manager'],
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    }
})

/// Person Model

const Person = mongoose.model('Person', personSchema);

module.exports = Person;