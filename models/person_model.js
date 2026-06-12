const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

personSchema.pre('save', async function() {
    const person = this;

    // Has the password only if it has been modified (or is new)
    if (!person.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);

        // hash password generation
        const hashedPassword = await bcrypt.hash(person.password, salt);
        person.password = hashedPassword;

        return;
    } catch (err) {
        return ;
    }
})

personSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}

/// Person Model

const Person = mongoose.model('Person', personSchema);

module.exports = Person;