const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Post routes
router.post('/api/departments', departmentController.createDepartment);

// Get routes
router.get('/api/departments', departmentController.getAllDepartments);
router.get('/api/departments/:id', departmentController.getDepartment);
router.get('/api/departments/:id/designations', departmentController.getDepartmentDesignations);

// Put routes (update)
router.put('/api/departments/:id', departmentController.updateDepartment);
router.put('/api/departments/designations/:departmentId', departmentController.updateDesignation);

// Delete routes
router.delete('/api/departments/:id', departmentController.deleteDepartment);

module.exports = router;
