const express = require('express')
const router = express.Router()
const util = require('../util')

router.post('/list', util.cacheRouter((req, res) => {
	let pageindex = req.body.pageindex || 1
	let pagenum = req.body.pagenum || 10

	util.query('select COUNT(*) as count from articles where status=1', (err, result1) => {
		if (err) {
			throw new Error(err.code)
		}
		if (result1[0].count > 0) {
			util.query({
				sql: 'select * from articles where status=1 limit ?,?',
				values: [Math.floor((pageindex - 1) * pagenum), Math.floor(pagenum)]
			}, (err, result2) => {
				if (err) {
					console.log(err.code);
				}
				res.json({
					code: '200',
					pageindex: pageindex,
					pagenum: pagenum,
					total: result1[0].count,
					data: result2
				})
			})
		} else {
			res.json({
				code: '200',
				pageindex: pageindex,
				pagenum: pagenum,
				total: result1[0].count,
				data: []
			})
		}
	})

}))

router.post('/view', (req, res) => {
	let id = req.body.id;

	if (id) {
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
		util.resMsg(res, 'id不能为空')
	}

})

module.exports = router
