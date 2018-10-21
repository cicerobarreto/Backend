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
        createdAt: message.createdAt,
        createdFor: message.createdFor
    })
    return message
}

const remove = async (message) => {
    await Message.collection.deleteOne({"_id": ObjectId(message._id)})
    return message
}

const removeUserMsgs = async (user) => {
    await Message.collection.deleteMany({"user._id": user._id})
    return user
}

const removeUserBotMsgs = async (user) => {
    await Message.collection.deleteMany({"createdFor": user._id})
    return user
}

module.exports = { findByDate, insert, remove, removeUserMsgs, removeUserBotMsgs }