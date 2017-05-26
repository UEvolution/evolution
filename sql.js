var mysql = require('mysql')
var config = require('./config')
var pool = mysql.createPool(config.db)

function query(sql, callback) {
	pool.getConnection(function (err, connection) {
		// Use the connection
		connection.query(sql, function (err, rows) {
			var result;
			if (typeof rows === 'undefined') {
				result = {
					code: '100',
					msg: err.code
				};
			} else {
				result = {
					code: '200',
					msg: '操作成功',
					data: rows
				};
			}
			callback(result);
			connection.release(); //释放链接
		});
	});
}

exports.query = query;
