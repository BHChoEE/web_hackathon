const FavoriteSchema = require('./Favorite.js');

var Favorite = null;

class FavoriteSocket {
    constructor(con) {
        Favorite= con.model('Favorite', FavoriteSchema);
    }
    addFavorite(data, res) {
        var newFavorite = new Favorite({
            title: data.title,
            id: data.id,
            user: data.user
        });
        newFavorite.save(function(err, data){
            if(err){
                console.log(err);
                res.send(err);
            } else {
                console.log(data);
                res.send(data)
            }
        });
    };
    removeFavorite(data, res) {
        const query = {id: data.id, user: data.user};
        Favorite.findOneAndRemove(query, function(err, result){
            if(error) {
                console.log(error);
                res.send(error);
                return;
            } else {
                console.log(result);
                res.send(result);
            }

        })
    }
}
module.exports = FavoriteSocket;
