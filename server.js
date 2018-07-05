const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserSocket = require('./src/database/UserSocket.js');
const FavoriteSocket = require('./src/database/FavoriteSocket.js');

// setup server
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// for database
const con = mongoose.createConnection('mongodb://localhost/paperQuery');
const userSocket = new UserSocket(con);
const favoriteSocket = new FavoriteSocket(con);

app.post('/user/signup', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        updateTime: req.body.updateTime,
    };
    userSocket.storeUser(user, res);
});

app.post('/user/login', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        updateTime: req.body.updateTime,
    };
    userSocket.checkUser(user, res);
});

app.post('/favorite/add', (req, res) => {
    const favorite = {
        title: req.body.title,
        paperId: req.body.paperId,
        url: req.body.url,
        username: req.body.username,
    };
    favoriteSocket.addFavorite(favorite, res);
});

app.post('/favorite/remove', (req, res) => {
    const favorite = {
        paperId: req.body.paperId,
        username: req.body.username,
    };
    favoriteSocket.removeFavorite(favorite, res);
});

app.post('/favorite/all', (req, res) => {
    const { username } = req.body;
    favoriteSocket.loadFavoriteList(username, res);
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'), (error) => {
        if (error) {
            res.status(500).send(error);
        }
    });
});

const port = 3000;
server.listen(port);
console.log(`Started on port ${port}`);
