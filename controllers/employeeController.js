// Employee Controller
const Booking = require('../models/Booking');

exports.getAssignedBookings = async (req, res) => {
    try {
        // Find bookings where assignedEmployees array contains req.user.id
        const bookings = await Booking.find({ assignedEmployees: req.user.id })
            .populate('customer', 'name phone eventDate') // Minimal details
            .select('-package -paymentStatus'); // Hide price? Package usually implies services. 
        // Requirement: "Employee cannot see Customer price"
        // Package model has Price. If we populate package, we should unselect price.
        // But if package logic is separate, we just need ensure Booking doesn't show paid amount if stored there.

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
