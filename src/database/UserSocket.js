const UserSchema = require('./User.js');
const mongoose = require('mongoose');
const crypto = require('crypto');

var User = null;

class UserSocket {
    constructor(con) {
        User = con.model('User', UserSchema);
    }

    encrypt(password) {
        var hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

    storeUser(data, res) {
        var newUser = new User({
            username: data.username,
            password: this.encrypt(data.password),
            updateTime: data.updateTime
        });
        newUser.save((error, data) => {
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                console.log(data);
                res.send(data);
            }
        });
    };

    checkUser(data, res) {
        User.find({'username': data.username}, (error, users) => {
            if (error) {
                console.log(error);
                res.send(error);
            }
            else if (users.length == 1) {
                var user = users[0];
                console.log(user);
                console.log(user.password)
                console.log(this.encrypt(data.password))
                if (user.password !== this.encrypt(data.password)) {
                    res.send('password wrong');
                }
                else {
                    res.send('redirect');
                }
            }
            else {
                console.log('user not found');
                res.send('user not found');
            }
        });
    };
}

module.exports = UserSocket;
