const FavoriteSchema = require('./Favorite');

class FavoriteSocket {
    constructor(con) {
        this.Favorite = con.model('Favorite', FavoriteSchema);
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
        this.Favorite.findOneAndUpdate(query, favorite, options, (error, result) => {
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
        this.Favorite.findOneAndRemove(query, (error, result) => {
            if (error) {
                console.log(error);
                res.send(error);
                return;
            }
            res.send(result);
        });
    }

    loadFavoriteList(username, res) {
        this.Favorite.find({ username }, (error, favorites) => {
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
