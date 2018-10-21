const { respondSuccess, respondErr } = require('../utils/responseUtils')

const moment = require('moment')
const locale = require('moment/locale/pt-br')
const services = require('../services')
const axios = require('axios')
const serviceMessage = services.messageService

const USER_BOT = {
    nome: 'Previ',
    email: 'previ@datataprev.gov.br',
    _id: '123456789'
}

const findByDate = (req, res) => {
    let dataExclusao = req.query.date;
    let arrDataExclusao = dataExclusao.split('/');

    let stringFormatada = arrDataExclusao[1] + '-' + arrDataExclusao[0] + '-' +
    arrDataExclusao[2];
    let dateFiltro = new Date(stringFormatada);

    const date = dateFiltro ? dateFiltro 
        : moment().endOf('day').toDate()
            
    serviceMessage.findByDate(date)
    .then(result => respondSuccess(res, 200, result))
    .catch(err => respondErr(res, 500, { errors: [`Consultar o Message: ${err} `] }))
}

const chatBot = async (msg, res) => {
    let baseURL = "https://api.dialogflow.com/v1/query?v=20150910";
    let token = "248f1c49d93b4c2c9114d3259e888817";
    console.log(`Name user: ${msg.user.name}`);
    
    let data = {
        contexts: [{"name": "hello_flow", 
                    "parameters": {"user_name": msg.user.name},
                    }],
        query : msg.text,
        lang: 'pt-BR',
        sessionId: '123456789!@#$%'
    }
    try {
        let response = await axios.post(`${baseURL}`, data, {headers: { Authorization: `Bearer ${token}` }})
        console.log(response.data.result.contexts);
        
        serviceMessage.insert({
            text: response.data.result.fulfillment.messages[0].speech,
            user: USER_BOT,
            createdAt: new Date(),
            createdFor: msg.user._id})

    } catch (error) {
        respondErr(res, 500, { errors: [`Consultar o Message: ${error} `] })
    }
    
}

const insert = (req, res) => {
            
    serviceMessage.insert({...req.body, createdAt: new Date()}
    ).then(async result => {
        await chatBot(req.body, res)
        respondSuccess(res, 200, result)
    })
    .catch(err => respondErr(res, 500, { errors: [`Consultar o Message: ${err} `] }))
}

const remove = (req, res) => {
    console.log(`Removendo...`)
    serviceMessage.remove({...req.body})
    .then(result => respondSuccess(res, 200, result))
    .catch(err => respondErr(res, 500, { errors: [`Consultar o Message: ${err} `] }))
}

const removeMsgUser = (req, res) => {
    console.log(`Removendo msg do : ${req.body._id}`)
    serviceMessage.removeUserMsgs({...req.body})
    .then(result => {
        serviceMessage.removeUserBotMsgs({...req.body})
        .then( result2 => respondSuccess(res, 200, result2))
        .catch(err => respondErr(res, 500, { errors: [`Consultar o Message: ${err} `] }))
    })
    .catch(err => respondErr(res, 500, { errors: [`Consultar o Message: ${err} `] }))
}

module.exports = { findByDate, insert, remove, removeMsgUser }