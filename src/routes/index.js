const express = require('express')
const authRoute = require('./authRoute')
const taskRoute = require('./taskRoute')

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

module.exports = { oapi, api }