const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.log('Admin credentials not found in env, skipping seed.');
            return;
        }

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin check: Admin already exists.');
            return;
        }

        const admin = new User({
            name: 'Super Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Admin Created Successfully');
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
};

module.exports = seedAdmin;
