const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

// Salary update route
router.post('/api/salary', salaryController.updateSalary);

// Get routes
router.get('/api/salary/:employeeId', salaryController.getSalary);
router.get('/api/salary/changes/:employeeId', salaryController.getSalaryChanges);
router.get('/api/employees/:employeeId/salaries', salaryController.getAllSalaryRecords);

module.exports = router;
