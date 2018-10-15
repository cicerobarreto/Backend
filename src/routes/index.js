const express = require('express')
const authRoute = require('./authRoute')
const taskRoute = require('./taskRoute')
const messageRoute = require('./messageRoute')

/*
 * Rotas abertas
 */
const oapi = express.Router()
oapi.post('/login', authRoute.login)
oapi.post('/validateToken', authRoute.validateToken)
oapi.post('/signup', authRoute.save)

/**
 * Rotas seguras
 */
const api = express.Router()
api.use(authRoute.auth)
api.use('/tasks',taskRoute.findByDate)
api.use('/insertTask',taskRoute.insert)
api.use('/updateTask',taskRoute.update)
api.use('/removeTask',taskRoute.remove)
api.use('/messages',messageRoute.findByDate)
api.use('/insertMessage',messageRoute.insert)
api.use('/removeMessage',messageRoute.remove)

module.exports = { oapi, api }