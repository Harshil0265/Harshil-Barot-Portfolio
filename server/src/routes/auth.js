const express = require('express')
const auth = require('../controllers/authController')
const requireAdmin = require('../middleware/auth')
const { rateLimit } = require('../lib/http')

const router = express.Router()

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many sign-in attempts. Please wait a few minutes and try again.',
})

router.post('/login', loginLimit, auth.login)
router.get('/me', requireAdmin, auth.me)
router.post('/password', requireAdmin, loginLimit, auth.changePassword)

module.exports = router
