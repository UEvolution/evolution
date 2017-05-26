var express = require('express')
var app = express()
var config = require('./config')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var multer = require('multer')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var user = require('./routers/user')


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

app.use('/user', user)

var server = app.listen(config.port, () => {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
