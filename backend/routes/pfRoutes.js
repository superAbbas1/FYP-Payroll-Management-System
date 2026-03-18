const express = require('express');
const router = express.Router();
const pfController = require('../controllers/pfController');

// Provident Fund routes
router.get('/provident-fund/:employeeID/:year', pfController.getProvidentFundByYear);
router.get('/provident-fund/:employeeID', pfController.getProvidentFund); 
router.post('/provident-fund/:employeeID/save', pfController.savePFRecord);

module.exports = router;
