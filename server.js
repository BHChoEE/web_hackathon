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

server.listen(3000);
console.log(`Started on port 3000`);
