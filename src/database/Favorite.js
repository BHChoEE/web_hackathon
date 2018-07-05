const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    title: String,
    paperId: String,
    url: String,
    username: String,
});

module.exports = favoriteSchema;
