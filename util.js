var mysql = require('mysql')
var config = require('./config')
var pool = mysql.createPool(config.db)
var crypto = require('crypto')
var redis = require('redis')
var redisQueue = redis.createClient()

var md5 = function (str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}

var util = {
	cacheRouter: (fn, t) => {
		var expiredTime = t || 60;
		return function (req, res, next) {
			var send = res.send;

			var method = req.method;
			var url = req.url;
			var query;

			if (method === 'GET') {
				query = req.query;
			} else {
				query = req.body;
			}

			var key = md5([method, url, JSON.stringify(query)].join(':'));
			redisQueue.get(key, function (err, value) {
				if (err) {
					return next(err);
				}

				if (value) {
					var data = value;
					try {
						data = JSON.parse(data);
					} catch (err) {
						console.log(err);
					}

					console.log('Read data from redis.');
			
					return res.send(data);
				}

				res.send = function (data) {
					redisQueue.setex(key, expiredTime, JSON.stringify(data));
					return send.call(this, data);
				}

				return fn.call(null, req, res);
			});
		}
	},
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
