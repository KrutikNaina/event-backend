const express = require('express');
const router = express.Router();
const { getAssignedBookings } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-bookings', protect, getAssignedBookings);

module.exports = router;
