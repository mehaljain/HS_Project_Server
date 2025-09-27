const mongoose = require('mongoose');

const OfferImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  // Add more fields if needed (e.g., adminId, description)
});

module.exports = mongoose.model('OfferImage', OfferImageSchema);
