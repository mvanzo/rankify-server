const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../../models')
const requiresToken = require('../requiresToken')
const user = require('../../models/user')

// POST /users/register -- CREATE a new user
router.post('/register', async (req, res) => {
  try {
    // check if the user exist already -- dont allow them to sign up again
    const userCheck = await db.User.findOne({
      email: req.body.email
    })

    if (userCheck) return res.status(409).json({ msg: 'did you forget that you already signed up w that email? 🧐' })

    // hash the pass (could validate if we wanted)
    const salt = 12
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // create a user in th db
    const newUser = await db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    // create a jwt payload to send back to the client 
    const payload = {
      name: newUser.name,
      email: newUser.email,
      id: newUser.id
    }

    // sign the jwt and send it (log them in)
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })

    res.json({ token })
  } catch (err) {
    console.log(err)
    res.status(503).json({ msg: 'oops server error 503 🔥😭' })
  }
})
// POST /users/login -- validate login credentials 
router.post('/login', async (req, res) => {
  // try to find the use in the db that is logging in
  const foundUser = await db.User.findOne({
    email: req.body.email
  })

  // if the user is not found -- return and send back a message that the user needs to sign up
  if (!foundUser) return res.status(400).json({ msg: 'bad login credentials 😢' })

  // check the password from the req.body again the password in the db
  const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)

  // if the provided info does not match -- send back an error message and return
  if (!matchPasswords) return res.status(400).json({ msg: 'bad login credentials 😢' })

  // create a jwt payload
  const payload = {
    name: foundUser.name,
    email: foundUser.email,
    id: foundUser.id
  }

  // sign the jwt
  const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

  // send it back
  res.json({ token })
})

// GET /users/auth-locked -- example of checking an jwt and not serving data unless the jwt is valid
router.get('/auth-locked', requiresToken, (req, res) => {
  res.json({ msg: 'welcome to the auth locked route, congrats on geting thru the middleware 🎉' })
})

// PUT /users/changepassword
router.put('/changepassword', async (req, res) => {
  try {
    // find user by email
    const user = await db.User.findOne({email: req.body.email})
    const oldPassword = user.password
    const salt = 12
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
      if (hashedPassword === oldPassword) {
        res.json({ msg: 'passwords are the same' })
      } else {
        const updatedUser = await db.User.findOneAndUpdate({email:user.email},
          {password: hashedPassword},
          { new: true }
          )
        res.json({ updatedUser })
      }
  } catch (error) {
    console.log(error)
    res.status(503).json({ msg: 'oops something went wrong' })
  }
})

// GET /users/profile
router.get('/profile', requiresToken, async (req, res) => {
  try {
    const userGameHistory = await db.User.findById(res.locals.user._id).populate({path:'games'})
    res.json(userGameHistory.games)
  } catch (error) {
    console.log(error)
    res.status(503).json({ msg: 'Database or server room is on fire 🔥'})
  }
})


module.exports = router