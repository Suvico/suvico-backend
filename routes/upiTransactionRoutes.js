const express = require('express');
const router = express.Router();
const upiTransactionController = require('../controllers/upiTransactionController');

// Define the route for creating a new UPI transaction
router.post('/upiTransaction', upiTransactionController.createTransaction);

// Route to check the mandate status
router.post('/checkMandateStatus', upiTransactionController.checkMandateStatus);

module.exports = router;
