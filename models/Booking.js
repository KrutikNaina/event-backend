const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' }, // Optional if custom
    eventDate: { type: Date, required: true },
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Only employees
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Partial'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
