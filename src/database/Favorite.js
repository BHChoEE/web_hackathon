const mongoose = require('mongoose');
const favoriteSchema = mongoose.Schema({
    title: String,
    paperId: String,
    username: String
})

module.exports = favoriteSchema;