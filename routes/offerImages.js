const express = require('express');
const OfferImage = require('../models/OfferImage');

const router = express.Router();

// GET /api/offers/images - get all offer images
router.get('/images', async (req, res) => {
  try {
    const images = await OfferImage.find().sort({ uploadedAt: -1 });
    res.json({ images });
  } catch (err) {
    console.error('Error fetching offer images:', err);
    res.status(500).json({ error: 'Failed to fetch offer images' });
  }
});

module.exports = router;
