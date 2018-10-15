const mongoose = require('mongoose')
const User = require('./user')

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    
    createAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('message', messageSchema)