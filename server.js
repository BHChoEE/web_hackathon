var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// setup server
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname ,'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// for database
const con = mongoose.createConnection('mongodb://localhost/paperQuery');
const UserSocket = require('./src/database/UserSocket.js');
const userSocket = new UserSocket(con);
const FavoriteSocket = require('./src/database/FavoriteSocket.js');
const favoriteSocket = new FavoriteSocket(con);

// render an API index page
app.post('/user/signup', function(req, res){
	var user = {
		username: req.body.username,
		password: req.body.password,
		updateTime: req.body.updateTime
	}
	// should be modified to store new user in DB
	userSocket.storeUser(user, res);
});
app.post('/user/login', function(req, res){
	var user = {
		username: req.body.username,
		password: req.body.password,
		updateTime: req.body.updateTime
	}
	// should be modified to check users in DB
	userSocket.checkUser(user, res);
});
app.post('/favorite/add', function(req, res){
	var favorite = {
		title: req.body.title,
		id: req.body.id,
		user: req.body.user,
	}
	favoriteSocket.addFavorite(favorite, res);
});
app.post('/favorite/remove', function(req, res){
	var favorite = {
		title: req.body.title,
		id: req.body.id,
		user: req.body.user,
	}
	favoriteSocket.removeFavorite(favorite, res);
});
app.post('/favorite/all', function(req, res){
	const user = req.body.user;
	favoriteSocket.loadFavoriteList(user, res);
})
app.get('/*', function(req, res){
	res.sendFile(path.join(__dirname, '/public/index.html'), function(err){
		if(err){res.status(500).send(err);}
	});
});

server.listen(3000);
console.log(`Started on port 3000`);
