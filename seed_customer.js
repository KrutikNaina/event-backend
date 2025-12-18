const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management_db')
    .then(async () => {
        console.log(`Connected to DB at: ${process.env.MONGO_URI}`);

        const testPhone = "9876543210";
        const testId = "CUST-DEMO";

        // Check if exists
        let customer = await Customer.findOne({ phone: testPhone });
        if (!customer) {
            customer = new Customer({
                name: "Demo Customer",
                phone: testPhone,
                customerId: testId,
                assignedPackages: []
            });
            await customer.save();
            console.log("CREATED: Demo Customer");
        } else {
            console.log("EXISTS: Demo Customer");
        }

        console.log(`\nUse these credentials to test:`);
        console.log(`Phone: ${testPhone}`);
        console.log(`Customer ID: ${testId}`);

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
