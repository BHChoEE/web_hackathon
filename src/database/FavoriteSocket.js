const FavoriteSchema = require('./Favorite.js');

var Favorite = null;

class FavoriteSocket {
    constructor(con) {
        Favorite = con.model('Favorite', FavoriteSchema);
    }

    addFavorite(data, res) {
        var favorite = {
            title: data.title,
            paperId: data.paperId,
            username: data.username
        };
        var query = {
            paperId: data.paperId,
            username: data.username
        };
        var options = {
            upsert: true,
            new: true,
            setDefaultOnInsert: true
        };
        Favorite.findOneAndUpdate(query, favorite, options, (error, result) => {
            if (error) {
                console.log(error);
                res.send(error);
                return;
            }
            else {
                res.send(result);
            }
        });
    };

    removeFavorite(data, res) {
        const query = {paperId: data.paperId, username: data.username};
        Favorite.findOneAndRemove(query, (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            else {
                console.log(result);
                res.send(result);
            }
        });
    };

    loadFavoriteList(username, res) {
        Favorite.find({username: username}, (error, favorites) => {
            if (error) {
                console.log(error);
                res.send(error);
                return;
            }
            else {
                res.send(favorites);
            }
        });
    };
}

module.exports = FavoriteSocket;
