const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { respondSuccess, respondErr } = require('../utils/responseUtils')

const services = require('../services')
const serviceUser = services.userService

const auth = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		next()
	} else {
		var token = req.body.token || req.query.token || req.headers['authorization'] || ''
		token = token.split(' ')[1]
		if (!token) {
			respondErr(res, 403, { errors: ['Nenhum token encontrado'] })
		} else {
			jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
				if (err) {
					respondErr(res, 403, { errors: ['Falha ao verificar o token'] })
				} else {
					req.payload = decoded
					next()
				}
			})
		}
	}
}

const login = (req, res) => {

	const username = req.body.username || ''
	const password = req.body.password || ''

	serviceUser.findByUsername(username).then(user => {
		if (user && bcrypt.compareSync(password, user.password)) {
			const token = jwt.sign({ username: user.username, role: user.role }, process.env.AUTH_SECRET, { expiresIn: "7 days" })
			respondSuccess(res, 200, { token, username: user.username, email: user.email })
		} else {
			respondErr(res, 500, { errors: ['Usuário/Senha inválidos'] })
		}
	}).catch(err => {
		respondErr(res, 500, { errors: ['Erro ao conectar com o banco de dados'] })
	})
}

const obterHash = (password, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
	})
}

const save = (req, res) => {
	obterHash(req.body.password, hash => {
		const password = hash
		serviceUser.insert({ email: req.body.email, username: req.body.username, password: password })
			.then(result => respondSuccess(res, 200, result))
			.catch(err => respondErr(res, 500, { errors: [`Erro ao inserir usuário: ${err} `] }))
	})
}

const validateToken = (req, res) => {
	var token = req.body.token || req.query.token || req.headers['authorization'] || ''
	token = token.split(' ')[1]
	jwt.verify(token, env.authSecret, (err, decoded) => {
		respondSuccess(res, 200, { valid: !err })
	})
}

module.exports = { auth, login, validateToken, save }