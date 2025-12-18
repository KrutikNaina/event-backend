const User = require('../models/User');
const Customer = require('../models/Customer');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Expense = require('../models/Expense');

// --- Customer Management ---

// Add Customer
exports.addCustomer = async (req, res) => {
    const { name, phone } = req.body;
    try {
        const existingCustomer = await Customer.findOne({ phone });
        if (existingCustomer) return res.status(400).json({ message: 'Customer already exists' });

        const customerId = 'CUST-' + Math.floor(1000 + Math.random() * 9000);

        const customer = new Customer({
            name,
            phone,
            customerId
        });

        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// GetAll Customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate('assignedPackages');
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// --- Employee Management ---

// Add Employee
exports.addEmployee = async (req, res) => {
    const { name, email, password, serviceType } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const employee = new User({
            name,
            email,
            password,
            role: 'employee',
            serviceType
        });

        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get All Employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// --- Package Management ---

// Create Package
exports.createPackage = async (req, res) => {
    const { name, price, description, servicesIncluded } = req.body;

    let images = [];
    let videos = [];
    if (req.files) {
        if (req.files.images) images = req.files.images.map(f => f.path);
        if (req.files.videos) videos = req.files.videos.map(f => f.path);
    }

    try {
        const pkg = new Package({
            name,
            price,
            description,
            servicesIncluded: servicesIncluded ? servicesIncluded.split(',').map(s => s.trim()) : [],
            images,
            videos
        });

        await pkg.save();
        res.status(201).json(pkg);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get All Packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Assign Package to Customer
exports.assignPackage = async (req, res) => {
    const { customerId, packageId } = req.body;
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        customer.assignedPackages.push(packageId);
        await customer.save();
        res.json({ message: 'Package assigned successfully', customer });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// --- Booking Management ---

// Book Event
exports.bookEvent = async (req, res) => {
    const { customerId, packageId, eventDate, assignedEmployees } = req.body;
    try {
        const booking = new Booking({
            customer: customerId,
            package: packageId,
            eventDate,
            assignedEmployees: assignedEmployees || []
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get All Bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('customer', 'name phone')
            .populate('package', 'name price')
            .populate('assignedEmployees', 'name serviceType');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// --- Expense Management ---

exports.addExpense = async (req, res) => {
    const { amount, category, description, type, date } = req.body;
    try {
        const expense = new Expense({
            amount,
            category,
            description,
            type,
            date: date || Date.now()
        });
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        const summary = expenses.reduce((acc, curr) => {
            if (curr.type === 'income') acc.income += curr.amount;
            if (curr.type === 'expense') acc.expense += curr.amount;
            return acc;
        }, { income: 0, expense: 0 });

        res.json({ expenses, summary });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// --- OTP Management ---

exports.getPendingOTPs = async (req, res) => {
    try {
        // Find customers with an OTP that hasn't expired
        const customers = await Customer.find({
            otp: { $exists: true, $ne: null },
            otpExpires: { $gt: new Date() }
        }).select('name phone otp otpExpires');

        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
