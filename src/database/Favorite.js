const mongoose = require('mongoose');
const favoriteSchema = mongoose.Schema({
    title: String,
    id: String,
    user: String
})

module.exports = favoriteSchema;