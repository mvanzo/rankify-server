const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    userId: Number,
    score: Number
}, {timestamps: true})

module.exports = mongoose.model('Game', gameSchema)