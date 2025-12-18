const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    type: { type: String, enum: ['income', 'expense'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
