const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    userId: String,
    score: Number,
    artistId: String,
    // need to add array of spotify song ids that were played in the game
    // songs: [{type: Number}]
}, {timestamps: true})

module.exports = mongoose.model('Game', gameSchema)