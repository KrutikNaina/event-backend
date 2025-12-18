const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["https://event-management-xi-umber.vercel.app", "http://localhost:5173", "http://localhost:5000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use('/uploads', express.static('uploads'));

// Database Connection
// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        // Seed Admin on successful connection
        require('./seed')();
    })
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/employee', require('./routes/employeeRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));

app.get('/', (req, res) => {
    res.send('Event Management API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
