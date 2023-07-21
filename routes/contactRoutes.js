const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET request to render the contact form page
router.get('/form', contactController.getContactForm);

// POST request to submit the contact form
router.post('/submit', contactController.submitContactForm);

// GET request to get all contact form submissions
router.get('/submissions', contactController.getAllContactSubmissions);

module.exports = router;
