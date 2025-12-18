const express = require('express');
const router = express.Router();
const {
    addCustomer, getCustomers,
    addEmployee, getEmployees,
    createPackage, getPackages, assignPackage,
    bookEvent, getBookings,
    addExpense, getExpenses
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect, adminOnly);

// Customers
router.post('/customers', addCustomer);
router.get('/customers', getCustomers);

// Employees
router.post('/employees', addEmployee);
router.get('/employees', getEmployees);

// Packages
router.post('/packages', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 2 }]), createPackage);
router.get('/packages', getPackages);
router.post('/assign-package', assignPackage);

// Bookings
router.post('/bookings', bookEvent);
router.get('/bookings', getBookings);

// Expenses
router.post('/expenses', addExpense);
router.get('/expenses', getExpenses);

// OTPs
const { getPendingOTPs } = require('../controllers/adminController');
router.get('/active-otps', getPendingOTPs);

module.exports = router;
