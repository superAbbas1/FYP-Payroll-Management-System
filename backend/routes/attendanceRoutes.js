const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Get routes
router.get('/api/attendance', attendanceController.getAllAttendance);
router.get('/api/employee-attendance-today', attendanceController.checkAttendanceToday); 
router.get('/api/attendance/:employeeId', attendanceController.getAttendance);
router.get('/api/adminattendance/:employeeId', attendanceController.getAdminAttendance);

// Post routes
router.post('/api/attendance', attendanceController.markAttendance);
router.post('/api/auto-mark-absent', attendanceController.autoMarkAbsent);

// Save attendance (batch)
router.post('/attendance/:id', attendanceController.saveAttendance);

module.exports = router;
