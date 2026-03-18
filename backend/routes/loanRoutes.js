const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Get routes
router.get('/api/loans', loanController.getAllLoans);
router.get('/api/loan-requests/:employeeID', loanController.getEmployeeLoanRequests);

// Post routes
router.post('/api/loan-request', loanController.createLoanRequest);

// Put routes (update)
router.put('/api/loans/:id', loanController.updateLoanStatus);

// Delete routes
router.delete('/api/to-delete-loan-request/:requestId/:employeeID', loanController.deleteLoanRequest);
router.delete('/api/admin/loan-request-delete/:id', loanController.deleteLoanRequestAdmin);

module.exports = router;
