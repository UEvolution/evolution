const express = require('express')
const router = express.Router()
const util = require('../util')
const fs = require('fs')
const jwt = require('jsonwebtoken')
var Geetest = require('gt3-sdk');


var captcha = new Geetest({
	geetest_id: 'c41cea693b85d4e772039df439b6945a',
	geetest_key: 'af76334a70ebd7b948790bc02b076a57'
});


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

router.get('/regcaptcha', (req, res) => {
	captcha.register(null, function (err, data) {
		if (err) {
			console.error(err);
			return;
		}
		if (!data.success) {
			// 进入 fallback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
			// 可以通过修改 hosts 把极验服务器 api.geetest.com 指到不可访问的地址
			// 为以防万一，你可以选择以下两种方式之一：
			// 1. 继续使用极验提供的failback备用方案
			req.session.fallback = true;
			res.send(data);
			// 2. 使用自己提供的备用方案
			// todo
		} else {
			// 正常模式
			req.session.fallback = false;
			res.send(data);
		}
	});
})

router.post('/validcaptcha', (req, res) => {
	captcha.validate(req.session.fallback, {
		geetest_challenge: req.body.geetest_challenge,
		geetest_validate: req.body.geetest_validate,
		geetest_seccode: req.body.geetest_seccode
	}, function (err, success) {
		if (err) {
			// 网络错误
			res.send(err);
		} else if (!success) {
			// 二次验证失败
			res.send("<h1 style='text-align: center'>登录失败</h1>");
		} else {
			res.send("<h1 style='text-align: center'>登录成功</h1>");
		}
	});
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
					code: '100',
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
