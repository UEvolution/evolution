var express = require('express')
var router = express.Router()
var sql = require('../sql')

var responseJSON = function (res, ret, msg) {
	var dataobj;
	if (typeof ret === 'undefined') {
		res.json({
			code: '100',
			msg: '操作失败'
		});
	} else {
		res.json({
			code: '200',
			msg: '',
		});
	}
};

router.get('/aaa', (req, res) => {
	sql.query('select name,password from user', function (err, result) {
		res.json(result)
	})
})

router.post('/login', (req, res) => {
	var name = req.body.name;
	var pwd = req.body.password;

	sql.query('select name,password from user where name="' + name + '" and password="' + pwd + '"', function (err, result) {
		res.json(result)
	})
})

router.get('/info', (req, res) => {
	if (req.session.user) {
		var user = req.session.user;
		res.json({
			code: '200',
			msg: '操作成功',
			data: user
		})
	} else {
		res.json({
			code: '100',
			error: '未登录'
		})
	}
})

module.exports = router
