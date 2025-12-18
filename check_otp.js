const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management_db')
    .then(async () => {
        console.log(`Connected to DB at: ${process.env.MONGO_URI}`);

        const users = await User.find({});
        console.log(`Found ${users.length} Users.`);
        users.forEach(u => console.log(`User: ${u.email}, Role: ${u.role}`));

        const customers = await Customer.find({});
        console.log(`Found ${customers.length} Customers.`);
        customers.forEach(c => {
            console.log(`Customer: ${c.name}, Phone: ${c.phone}, OTP: ${c.otp}, Expires: ${c.otpExpires}`);
        });

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
