const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth');

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  body('source')
    .isArray({ min: 1 }).withMessage('Please select at least one option')
];

// Public route - Submit contact form
router.post('/submit', contactValidation, contactController.submitContact);

// Admin routes (protected)
router.get('/', auth, contactController.getAllContacts);
router.get('/stats', auth, contactController.getContactStats);
router.get('/:id', auth, contactController.getContact);
router.patch('/:id/status', auth, contactController.updateContactStatus);
router.delete('/:id', auth, contactController.deleteContact);

module.exports = router;
