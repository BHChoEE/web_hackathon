const UserSchema = require('./User.js');
const mongoose = require('mongoose');

var User = null;

class UserSocket {
    constructor(con) {
        User = con.model('User', UserSchema);
    }

    storeUser(data, res) {
        var newUser = new User({
            username: data.username,
            updateTime: data.updateTime
        });
        newUser.save((err, data) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                console.log(data);
                res.send(data);
            }
        });
    };

    checkUser(data, res) {
        User.find({'username': data.username}, (err, user) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else if (user.length == 1) {
                console.log(user);
                res.send('redirect');
            }
            else {
                console.log('user not found');
                res.send('user not found');
            }
        });
    };
}

module.exports = UserSocket;
