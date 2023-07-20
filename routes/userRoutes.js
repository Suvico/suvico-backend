const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/Suvico', userController.createSuvico);
router.get('/getBankList', userController.getBankList); // Add the new route for getting the bank list
router.get('/getCategoryList', userController.getCategoryList); // Add the new route for getting the category list


module.exports = router;
