const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/Suvico', userController.createSuvico);
router.get('/getBankList', userController.getBankList); 
router.get('/getCategoryList', userController.getCategoryList); 
router.post('/checkMandateStatus', userController.checkMandateStatus);


module.exports = router;
