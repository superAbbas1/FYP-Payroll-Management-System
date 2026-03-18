const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

// Post routes
router.post('/api/leaves', leaveController.createLeaveRequest);

// Get routes
router.get('/api/leaves', leaveController.getAllLeaveRequests);
router.get('/api/leaves/:employeeId', leaveController.getEmployeeLeaveRequests);

// Put routes (update)
router.put('/api/leaves/:id', leaveController.updateLeaveRequestStatus);

// Delete routes
router.delete('/api/leaves/:id', leaveController.deleteLeaveRequest);
router.delete('/api/admin-leaves/:id', leaveController.deleteLeaveRequestAdmin);

module.exports = router;
