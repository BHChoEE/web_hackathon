var http = require('http');
var express = require('express');
var path = require('path');

// setup server
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname ,'public')));

// render an API index page
app.get(['/', '/index'], function(req, res){
	res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/main', function(req, res){
	res.sendFile(path.join(__dirname, './public/main.html'));
});

app.get('/redirect', function(req, res){
	console.log(req.query.query);
	res.redirect(req.query.page);	
});

server.listen(3000);
console.log(`Started on port 3000`);
