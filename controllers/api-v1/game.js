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


// POST /game/:id
// 3-27 draft
// POST /users/game/:id (create a score with :id)-- would this be /profile?? and just a get route instead of a post route?
router.post('/:id', async (req, res) => {
    try {
        const postScore = await db.Game.create(req.body)
        res.status(201).json(postScore)
    } catch (error) {
        console.log(error)
        res.status(503).json({ msg: 'Database or server room is on fire 🔥' })
    }
})


// DELETE /game/:id
// 3-27 draft
// DELETE /users/game/:id (delete a game @ :id)
router.delete('/:id', async (req, res) => {
    try {
        const foundScore = await db.Game.findByIdAndDelete(req.params._id)
        res.status(204).json({ msg: 'Score has been successfully deleted' })
    } catch (error) {
        console.log(error)
        res.status(503).json({ msg: 'Database or server room is on fire 🔥'})
    }
})


// POST /song -- stretch goal
// save song id and preview url

module.exports = router