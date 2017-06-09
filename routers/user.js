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

router.post('/checkname', (req, res) => {
	let name = req.body.username;

	util.query({
		sql: 'select username from user where username=? and status=1',
		values: [name]
	}, (err, result) => {
		if (result && result.length > 0) {
			util.resMsg(res, '已有相同账户')
		} else {
			res.json({
				code: '200',
				msg: '验证成功，可以注册'
			});
		}
	})
})

router.post('/register', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let code = req.body.code;

	if (username && password) {
		if (code == 1111) {
			util.query({
				sql: 'insert into user (username,password,email,addtime,updatetime,status) values (?,?,?,?,?,?)',
				values: [username, password, email, new Date(), new Date(), 1]
			}, (err, result) => {
				if (err) {
					throw err
					return
				}
				if (result && result.length > 0) {
					util.resMsg(res, '已有相同账户')
				} else {
					res.json({
						code: '200',
						msg: '验证成功，可以注册'
					});
				}
			})
		} else {
			util.resMsg(res, '验证码错误')
		}
	} else {
		util.resMsg(res, '用户名和密码不能为空')
	}

})

router.post('/login', (req, res) => {
	let name = req.body.username;
	let pwd = req.body.password;

	util.query({
		sql: 'select id,username,email,truename from user where username=? and password=? and status=1',
		values: [name, pwd]
	}, (err, result) => {
		//		res.json(result)
		req.session.user = result

		if (result && result.length > 0) {
			//			var cert = fs.readFileSync('./shaw_rsa')
			//			var token = jwt.sign({
			//				user: result[0].id
			//			}, cert, {
			//				algorithm: 'RS256'
			//			}, (err, token) => {
			//				console.log(err);
			//				util.resJSON(res, {
			//					token: token
			//				}, '登录成功')
			//			})
			var token = jwt.sign(result[0], 'dxc', (err, token) => {
				console.log(err);
				util.resJSON(res, {
					token: token
				}, '登录成功')
			})
		} else {
			util.resMsg(res, '登录失败,用户名或密码错误')
		}

	})
})

router.post('/info', (req, res) => {
	let token = req.body.token;
	jwt.verify(token, 'dxc', (err, decoded) => {
		if (err) {
			util.resMsg(res, err.message)
		} else {
			if (decoded) {
				util.resJSON(res, decoded)
			} else {
				res.json({
					code: '402',
					msg: '未登录'
				});
			}
		}
	});

	//	if (req.session.user) {
	//		let user = req.session.user;
	//		util.resJSON(res, user)
	//	} else {
	//		res.json({
	//			code: '402',
	//			msg: '未登录'
	//		});
	//	}

})


router.post('/update', (req, res) => {
	let uid = req.body.uid;
	let email = req.body.email;

	if (uid) {
		util.query({
			sql: 'update user set email=?,updatetime=? where id=? and status=1',
			values: [email, new Date(), uid]
		}, (err, result) => {
			if (err) {
				throw err
				return
			}
			res.json({
				code: '200',
				msg: '修改成功'
			});
		})

	} else {
		util.resMsg(res, 'uid不能为空')
	}
})

router.post('/delete', (req, res) => {
	let uid = req.body.uid;
	if (uid) {
		util.query({
			sql: 'update user set status=0 where id=?',
			values: [uid]
		}, (err, result) => {
			if (err) {
				throw err
				return
			}
			res.json({
				code: '200',
				msg: '修改成功'
			});
		})

	} else {
		util.resMsg(res, 'uid不能为空')
	}
})


module.exports = router
