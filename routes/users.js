const express = require('express')
const { token } = require('morgan')
const router = express.Router()
const { checkAuth } = require('../middleware/checkAuth')

const User = require('../models/user')

router.get('/', checkAuth, (req, res) => {
  const email = JSON.parse(
    atob(req.headers['authorization'].split('.')[1].email)
  )
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.json({
        status: 'FAILED'
      })
      throw err
    } else {
      return res.json(user)
    }
  })
})

router.put('/updateInfo', checkAuth, (req, res) => {
  const { email } = req.body
  User.findOneAndUpdate(
    { email },
    {
      $set: req.body
    },
    { new: true },
    (err, result) => {
      if (err) {
        res.send(err.message)
      } else {
        return res.json({
          status: 'SUCCESS',
          message: 'Update successful',
          data: result
        })
      }
    }
  )
})

router.delete('/delete/:id', checkAuth, (req, res) => {
  const { id } = req.params
  User.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      res.send(err.message)
    } else {
      return res.json({
        status: 'SUCCESS',
        message: 'Delete successful'
      })
    }
  })
})

module.exports = router
