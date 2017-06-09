const express = require('express')
const router = express.Router()
const util = require('../util')

router.post('/list', (req, res) => {
	util.query('select * from articles where status=1', (err, result) => {
		util.resJSON(res, result)
	})
})

router.post('/view', (req, res) => {
	let id = req.body.id;

	if (id) {
		if (code == 1111) {
			util.query({
				sql: 'select * from articles where status=1 and id=?',
				values: [id]
			}, (err, result) => {
				if (err) {
					throw err
					return
				}
				util.resJSON(res, result)
			})
		} else {
			util.resMsg(res, '验证码错误')
		}
	} else {
		util.resMsg(res, '用户名和密码不能为空')
	}

})

module.exports = router
