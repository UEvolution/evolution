var mysql = require('mysql')
var config = require('./config')
var pool = mysql.createPool(config.db)

function query(sql, callback) {
	pool.getConnection(function (err, connection) {
		// Use the connection
		connection.query(sql, function (err, rows) {
			callback(err, rows);
			connection.release(); //释放链接
		});
	});
}

exports.query = query;
