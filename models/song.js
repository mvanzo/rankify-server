const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    spotifySongId: String,
    previewUrl: String
}, {timestamps: true})

// create and export the model
module.exports = mongoose.model('Song', songSchema)