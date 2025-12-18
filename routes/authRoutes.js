const express = require('express');
const router = express.Router();
const { adminLogin, employeeLogin, customerLoginRequestOTP, customerVerifyOTP } = require('../controllers/authController');

router.post('/admin/login', adminLogin);
router.post('/employee/login', employeeLogin);
router.post('/customer/login-otp', customerLoginRequestOTP);
router.post('/customer/verify-otp', customerVerifyOTP);

module.exports = router;
