var mysql = require('mysql')
var config = require('./config')
var pool = mysql.createPool(config.db)

var util = {
	query: (sql, callback) => {
		pool.getConnection(function (err, connection) {
			connection.query(sql, function (err, rows) {
				callback(err, rows);
				connection.release(); //释放链接
			});
		});
	},
	resJSON: (res, ret, msg) => {
		if (typeof ret === 'undefined') {
			res.json({
				code: '100',
				msg: msg || '操作失败'
			});
		} else {
			res.json({
				code: '200',
				msg: msg || '操作成功',
				data: ret
			});
		}
	},
	resMsg: (res, msg) => {
		util.resJSON(res, undefined, msg)
	}
}

//exports.util = util;
module.exports = util
