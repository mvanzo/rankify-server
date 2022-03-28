const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    userId: String,
    score: Number,
    artistId: String
}, {timestamps: true})

module.exports = mongoose.model('Game', gameSchema)