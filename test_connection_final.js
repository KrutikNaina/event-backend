
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGO_URI;

console.log("Testing connection to Atlas...");

if (!uri) {
    console.error("MONGO_URI not found in .env");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to MongoDB Atlas.');
        console.error('Error Code:', err.code);
        console.error('Error Name:', err.name);
        console.error('Message:', err.message);
        process.exit(1);
    });
