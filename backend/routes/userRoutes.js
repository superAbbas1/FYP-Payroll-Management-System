const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//getting employee name using his dept and designation
// router.get('/employeeslist', userController.getEmployeesList);
// router.get('/departments', userController.getDepartments);

// Authentication routes
router.post('/register', userController.registerEmployee);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);

// User profile routes
router.get('/user/:employeeID', userController.getUserProfile);
router.get('/user/salary/:employeeID', userController.getUserSalary);

// Employee password routes
router.put('/employees/:id/updatePassword', userController.updatePassword);
router.post('/users/:id/validate-password', userController.validatePassword);

// Employee management routes
router.get('/employees/:id', userController.getEmployee);
router.put('/employees/:id', userController.updateEmployee);
router.delete('/employees/:id', userController.deleteEmployee);
router.get('/employeeslist', userController.getEmployeesList);
router.get('/departments', userController.getDepartments);

module.exports = router;