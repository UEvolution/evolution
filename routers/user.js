var express = require('express')
var router = express.Router()
var sql = require('../sql')

router.get('/aaa', (req, res) => {
	sql.query('select name,password from user', function (result) {
		res.json(result)
	})
})

router.post('/login', (req, res) => {
	req.body;
	var user = {
		name: "Chen-xy",
		age: "22",
		address: "bj"
	}
	req.session.user = user
	res.json(user)
})

router.get('/info', (req, res) => {
	if (req.session.user) {
		var user = req.session.user;
		res.json({
			user: user
		})
	} else {
		res.json({
			error: '未登录'
		})
	}
})

module.exports = router
