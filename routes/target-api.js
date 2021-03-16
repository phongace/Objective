const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { checkAuth } = require('../middleware/checkAuth')
const Target = require('../models/target')

router.post('/', checkAuth, (req, res) => {
  if (req.headers && req.headers.authorization) {
    var decoded = jwt.verify(
      req.headers['authorization'].split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET
    )
    var userId = decoded.id

    let { title, description, time } = req.body
    title = title.trim()
    description = description.trim()
    time = time.trim()

    if (title === '' || time === '') {
      res.json({
        status: 'FAILED',
        message: 'Empty input fields!'
      })
    } else {
      const target = new Target({
        userId,
        title,
        description,
        time,
        isDone: false
      })
      target
        .save()
        .then(result => {
          res.json({
            status: 'SUCCESS',
            message: 'Target created!',
            data: result
          })
        })
        .catch(error => {
          res.status(500).json({
            status: 'FAILED',
            error
          })
        })
    }
  }
})

module.exports = router
