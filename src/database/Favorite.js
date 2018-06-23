const mongoose = require('mongoose');
const favoriteSchema = mongoose.Schema({
    title: String,
    id: String,
    username: String
})

module.exports = favoriteSchema;