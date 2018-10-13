const { Task } = require('../models')
const ObjectId = require('mongodb').ObjectID;

const findByDate = date => {
    return Task.find({ estimateAt: { $lte: date} })
}

const insert = async (task) => {
    await Task.collection.insertOne(task)
    return task
}

const update = async (task) => {
    console.log(task);    
    try {
        await Task.collection.updateOne({"_id": ObjectId(task._id)},
                                        { $set: {doneAt: task.doneAt}},
                                        { upsert: false })
    } catch (error) {
        console.log(error)
    }    
    return task
}

const remove = async (task) => {
    console.log(task);    
    await Task.collection.deleteOne({"_id": ObjectId(task._id)})
    return task
}

module.exports = { findByDate, insert, update, remove }