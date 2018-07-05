const FavoriteSchema = require('./Favorite.js');

let Favorite = null;

class FavoriteSocket {
    constructor(con) {
        Favorite = con.model('Favorite', FavoriteSchema);
    }

    addFavorite(data, res) {
        const favorite = {
            title: data.title,
            paperId: data.paperId,
            url: data.url,
            username: data.username,
        };
        const query = {
            paperId: data.paperId,
            username: data.username,
        };
        const options = {
            upsert: true,
            new: true,
            setDefaultOnInsert: true,
        };
        Favorite.findOneAndUpdate(query, favorite, options, (error, result) => {
            if (error) {
                console.log(error);
                res.send(error);
                return;
            }
            res.send(result);
        });
    }

    removeFavorite(data, res) {
        const query = { paperId: data.paperId, username: data.username };
        Favorite.findOneAndRemove(query, (error, result) => {
            if (error) {
                console.log(error);
                res.send(error);
                return;
            }
            console.log(result);
            res.send(result);
        });
    }

    loadFavoriteList(username, res) {
        Favorite.find({ username }, (error, favorites) => {
            if (error) {
                console.log(error);
                res.send(error);
                return;
            }
            res.send(favorites);
        });
    }
}

module.exports = FavoriteSocket;
