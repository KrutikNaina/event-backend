const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    servicesIncluded: [{ type: String }], // List of services like DJ, Food
    images: [{ type: String }], // URLs
    videos: [{ type: String }], // URLs
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
