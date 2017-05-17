var express = require('express')
var app = express()
var router = require('./router')
var config = require('./config')
var mysql = require('mysql')


var connection = mysql.createConnection(config.db)

console.log(config.db)

var server = app.listen(config.port, function () {
	var host = server.address().address;
	var port = server.address().port;


	console.log('Example app listening at http://%s:%s', host, port);
});