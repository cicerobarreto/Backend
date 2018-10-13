const mongoose = require('mongoose')
const User = require('./user')

const taskSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    estimateAt: {
        type: Date,
        required: false
    },
    doneAt: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model('task', taskSchema)