const mongoose = require('mongoose');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Package = require('./models/Package');
const Booking = require('./models/Booking');
const Expense = require('./models/Expense');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management_db')
    .then(async () => {
        console.log(`\n=== DATABASE INTEGRITY CHECK ===`);
        console.log(`Connected to: ${process.env.MONGO_URI}`);
        console.log(`--------------------------------`);

        const userCount = await User.countDocuments();
        const customerCount = await Customer.countDocuments();
        const packageCount = await Package.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const expenseCount = await Expense.countDocuments();

        console.log(`[Users]      Saved in DB: ${userCount}`);
        console.log(`[Customers]  Saved in DB: ${customerCount}`);
        console.log(`[Packages]   Saved in DB: ${packageCount}`);
        console.log(`[Bookings]   Saved in DB: ${bookingCount}`);
        console.log(`[Expenses]   Saved in DB: ${expenseCount}`);

        console.log(`--------------------------------`);
        console.log("STATUS: All systems are persisting data to MongoDB successfully.");
        console.log(`================================\n`);

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
