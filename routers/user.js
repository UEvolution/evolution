const express = require('express')
const router = express.Router()
const util = require('../util')
const fs = require('fs')
const jwt = require('jsonwebtoken')

router.get('/aaa', (req, res) => {
	util.query('select username,password from user', (err, result) => {
		res.json(result)
	})
})

router.post('/login', (req, res) => {
	let name = req.body.username;
	let pwd = req.body.password;

	util.query({
		sql: 'select username,password from user where username=? and password=?',
		values: [name, pwd]
	}, (err, result) => {
		//		res.json(result)
		req.session.user = result

		var cert = fs.readFileSync('./shaw_rsa')
		var token = jwt.sign(result[0], cert, {
			algorithm: 'RS256'
		})

		console.log(token);

		util.resJSON(res, result)
	})
})

router.get('/info', (req, res) => {
	if (req.session.user) {
		let user = req.session.user;
		util.resJSON(res, user)
	} else {
		util.resMsg(res, '未登录')
	}
})


module.exports = router
