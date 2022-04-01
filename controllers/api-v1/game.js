const express = require('express')
const router = express.Router()
const db = require('../../models')


// from game, score will be saved to database
// user can access from profile (GET route from users to display scores)

// GET /game 
router.get('/', async (req, res) => {
    try {
        // find all games
        const games = await db.Game.find({})
        res.json(games)
    } catch (error) {
        console.log(error)
        res.status(503).json({ msg: 'Database or server room is on fire 🔥'})
    }
})


// POST /game/:id (create a score with :id)
router.post('/:id', async (req, res) => {
    try {
        // create game result for user
        const postGame = await db.Game.create({
            artistName: req.body.artistName,
            difficulty: req.body.difficulty,
            userId: req.body.userId,
            score: req.body.score,
            songsPlayed: req.body.songsPlayed,
            artistId: req.params.id
        })
        // find user and add postGame to their scores
        const userToUpdate = await db.User.findByIdAndUpdate(req.body.userId, {$push: {games: postGame._id}})
        userToUpdate.save();
        res.status(201).json(userToUpdate)
    } catch (error) {
        console.log(error)
        res.status(503).json({ msg: 'Database or server room is on fire 🔥' })
    }
})


// DELETE /game/:id (delete a game @ :id)
router.delete('/:id', async (req, res) => {
    try {
        const foundScore = await db.Game.findByIdAndDelete(req.params.id)
        res.status(204).json({ msg: 'Score has been successfully deleted' })
    } catch (error) {
        console.log(error)
        res.status(503).json({ msg: 'Database or server room is on fire 🔥'})
    }
})

module.exports = router