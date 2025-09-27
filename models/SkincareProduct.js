const mongoose = require('mongoose');

const skincareProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  offer: { type: Number },
  images: { type: [String], required: true },
  range: { type: String },
  skinType: { type: [String] },
  skinConcern: { type: [String] },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SkincareProduct', skincareProductSchema);
