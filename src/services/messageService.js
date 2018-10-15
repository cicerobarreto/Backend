const { Message } = require('../models')
const ObjectId = require('mongodb').ObjectID;

const findByDate = date => {
    return Message.find({
        createdAt: {
            $lte: date
        }
    }).sort({
        createdAt: -1
    })
}

const insert = async (message) => {
    await Message.collection.insertOne({
        text: message.text,
        user: message.user,
        createdAt: message.createdAt 
    })
    return message
}

const remove = async (message) => {
    console.log(message);    
    await Message.collection.deleteOne({"_id": ObjectId(message._id)})
    return message
}

module.exports = { findByDate, insert, remove }