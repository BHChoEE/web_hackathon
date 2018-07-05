const crypto = require('crypto');
const UserSchema = require('./User.js');

function encrypt(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

let User = null;

class UserSocket {
    constructor(con) {
        User = con.model('User', UserSchema);
    }

    storeUser(data, res) {
        const newUser = new User({
            username: data.username,
            password: encrypt(data.password),
            updateTime: data.updateTime,
        });
        newUser.save((error, data_) => {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(data_);
                res.send(data);
            }
        });
    }

    checkUser(data, res) {
        User.find({ username: data.username }, (error, users) => {
            if (error) {
                console.log(error);
                res.send(error);
            } else if (users.length === 1) {
                const user = users[0];
                if (user.password !== encrypt(data.password)) {
                    res.send('Password is wrong!');
                } else {
                    res.send('redirect');
                }
            } else {
                console.log('User not found!');
                res.send('User not found!');
            }
        });
    }
}

module.exports = UserSocket;
