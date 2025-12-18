const User = require('../models/User');
const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Admin Login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'admin' });
        if (!user) return res.status(401).json({ message: 'Invalid Admin Credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid Admin Credentials' });

        const token = generateToken(user._id, 'admin');
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'admin' } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Employee Login
exports.employeeLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'employee' });
        if (!user) return res.status(401).json({ message: 'Invalid Employee Credentials' });

        // Check if password works (admins set passwords for employees)
        // Assuming simple password for now, or hashed if admin sets it
        // Wait, requirement says "Login via email only" in one place?
        // "Employee accounts are created only by Admin. Login via email only. No self-registration allowed."
        // Usually implies password too, otherwise it's insecure.
        // "Employee login flow: ... Login via email only"? Maybe it implies OTP or just email?
        // "Login using: Phone Number + OTP" is for CUSTOMER.
        // "Employee Authentication ... Login via email only".
        // I will assume Password is required because "Admin login... Password: Admin#5".
        // I will implement Password for Employee too. "No self-registration allowed" means Admin creates them with password.

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid Credentials' });

        const token = generateToken(user._id, 'employee');
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'employee', serviceType: user.serviceType } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Customer Login (Step 1: Request OTP)
exports.customerLoginRequestOTP = async (req, res) => {
    const { phone, customerId } = req.body;
    try {
        const customer = await Customer.findOne({ phone, customerId });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Generate numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB
        customer.otp = otp;
        customer.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now (Date Object)
        await customer.save();

        // Log action for Admin
        console.log(`[DATABASE] OTP stored successfully for ${phone}: ${otp}`);
        console.log(`[ACTION REQUIRED] Admin must check Dashboard or WhatsApp to send this OTP.`);

        res.json({ message: 'OTP requested. Please contact Admin.', phone });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Customer Login (Step 2: Verify OTP)
exports.customerVerifyOTP = async (req, res) => {
    const { phone, otp } = req.body;
    try {
        const customer = await Customer.findOne({ phone });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        if (customer.otp !== otp || customer.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or Expired OTP' });
        }

        // Clear OTP
        customer.otp = undefined;
        customer.otpExpires = undefined;
        await customer.save();

        const token = generateToken(customer._id, 'customer');
        res.json({ token, customer: { id: customer._id, name: customer.name, phone: customer.phone, role: 'customer' } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
