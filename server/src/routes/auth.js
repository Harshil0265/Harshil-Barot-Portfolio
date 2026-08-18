const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Create admin (use once to initialize)
router.post('/create-admin', authController.createAdmin);

// Login
router.post('/login', authController.login);

// Verify token
router.get('/verify', auth, authController.verifyToken);

module.exports = router;
