// Customer Controller
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');

exports.getCustomerDashboard = async (req, res) => {
    try {
        // req.user.id is the Customer ID from token
        const customer = await Customer.findById(req.user.id).populate('assignedPackages');

        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const bookings = await Booking.find({ customer: req.user.id });

        res.json({
            profile: customer,
            bookings
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
