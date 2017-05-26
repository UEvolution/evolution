var express = require('express')
var app = express()
var mysql = require('mysql')
var bodyParser = require('body-parser')
var multer = require('multer')
var router = require('./router')
var config = require('./config')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
//解析文件上传类型
//app.use(multer());

//加载静态目录
app.use(express.static('public'))

//设置cookie session
app.use(cookieParser('sessiontest'));
app.use(session({
	secret: 'sessiontest', //与cookieParser中的一致
	resave: true,
	saveUninitialized: true
}));


app.post('/login', function (req, res) {
	console.log(req.body);
	var user = {
		name: "Chen-xy",
		age: "22",
		address: "bj"
	}
	req.session.user = user
	res.json(user)
})

app.get('/info', function (req, res) {
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


app.get('/aaa', function (req, res) {
	throw new Error('oh no!')
})

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		errmsg: err.message
	})
});

var connection = mysql.createConnection(config.db)

console.log(config.db)

var server = app.listen(config.port, function () {
	var host = server.address().address;
	var port = server.address().port;


	console.log('Example app listening at http://%s:%s', host, port);
});
