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
// router.get('/:id', (req, res) => {
//     const { id } = req.params
//     console.log(id)
//     db.Game.findById(id)
//         .then(game => {
//             if (!game) return res.status(404).json({ msg: 'game not found' })
//             res.json(game)
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(503).json({ msg: 'server room is burned down' })
//         })
// })


// POST /game/:id
// 3-27 draft
// POST /users/game/:id (create a score with :id)-- would this be /profile?? and just a get route instead of a post route?
router.post('/:id', async (req, res) => {
    try {
        const postScore = await db.Game.create({
            userId: req.body.userId,
            score: req.body.score,
            artistId: req.params.id
        })
        res.status(201).json(postScore)
        // const newUser = await db.User.create({
        //     name: req.body.name,
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: hashedPassword
        // })
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