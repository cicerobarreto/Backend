const { respondSuccess, respondErr } = require('../utils/responseUtils')

const moment = require('moment')
const locale = require('moment/locale/pt-br')
const services = require('../services')
const serviceMessage = services.messageService

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

const insert = (req, res) => {
    serviceMessage.insert({...req.body, createdAt: new Date()}
    )
    .then(result => respondSuccess(res, 200, result))
    .catch(err => respondErr(res, 500, { errors: [`Consultar o Message: ${err} `] }))
}

const remove = (req, res) => {
    console.log(`Removendo...`)
    serviceMessage.remove({...req.body})
    .then(result => respondSuccess(res, 200, result))
    .catch(err => respondErr(res, 500, { errors: [`Consultar o Message: ${err} `] }))
}

module.exports = { findByDate, insert, remove }