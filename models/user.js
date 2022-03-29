const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  score: [{
    type: Number
    // array of gameSchema objectIds
  }],
  games: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Game'
    // array of game objectIds
  }]
}, {timestamps: true})

// create and export the model
module.exports = mongoose.model('User', userSchema)