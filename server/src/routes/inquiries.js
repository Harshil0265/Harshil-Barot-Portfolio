const express = require('express')
const inquiries = require('../controllers/inquiryController')
const requireAdmin = require('../middleware/auth')
const { rateLimit } = require('../lib/http')

const router = express.Router()

const submitLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'You’ve sent a few briefs already. Please wait a few minutes, or email me directly.',
})

// Public
router.post('/', submitLimit, inquiries.create)

// Admin
router.get('/', requireAdmin, inquiries.list)
router.get('/stats', requireAdmin, inquiries.stats)
router.get('/:id', requireAdmin, inquiries.get)
router.patch('/:id', requireAdmin, inquiries.update)
router.delete('/:id', requireAdmin, inquiries.remove)

module.exports = router
