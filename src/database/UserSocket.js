const crypto = require('crypto');
const UserSchema = require('./User');

function encrypt(plaintext) {
    const hash = crypto.createHash('sha256');
    hash.update(plaintext);
    return hash.digest('hex');
}

class UserSocket {
    constructor(con) {
        this.User = con.model('User', UserSchema);
    }

    storeUser(data, res) {
        const newUser = new this.User({
            username: data.username,
            password: encrypt(data.password),
            updateTime: data.updateTime,
        });
        newUser.save((error, saved) => {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                res.send(saved);
            }
        });
    }

    checkUser(data, res) {
        this.User.find({ username: data.username }, (error, users) => {
            if (error) {
                console.log(error);
                res.send(error);
            } else if (users.length === 0) {
                res.send('User not found!');
            } else if (users[0].password !== encrypt(data.password)) {
                res.send('Password is wrong!');
            } else {
                res.send('Log in successfully!');
            }
        });
    }
}

module.exports = UserSocket;
