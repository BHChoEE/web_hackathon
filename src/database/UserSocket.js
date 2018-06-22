const UserSchema = require('./User.js');
const mongoose = require('mongoose');

var User = null;

class UserSocket {
    constructor(con){
        User = con.model('User', UserSchema);
    }
    // for storing user data
    storeUser(data, res) {
        var newUser = new User({
            username: data.username,
            updateTime: data.updateTime
        });
        newUser.save(function(err, data) {
            if(err){
                console.log(err);
                res.send(err);
            } else {
                console.log(data);
                res.send(data);
            }
        });
    };
    // for log in user data
    checkUser(data, res) {
        var myUser = new User({
            username: data.username,
            updateTime: data.updateTime
        });
        User.find({'username': myUser.username}, function(err, user){
            if(err) {
                console.log(err);
                res.send(err);
            } else if(user.length == 1) {
                console.log(user);
                res.redirect('/main');
            } else {
                console.log('not found');
                res.send('not found');
            }
        });
    };
}
module.exports = UserSocket;