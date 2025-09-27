const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer setup for offer images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/offers');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, base + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage });


// POST /api/offers/upload - upload offer image and save to DB
const OfferImage = require('../models/OfferImage');
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const relPath = `/uploads/offers/${req.file.filename}`;
  try {
    const offerImage = new OfferImage({ url: relPath });
    await offerImage.save();
    res.json({ success: true, image: offerImage });
  } catch (err) {
    console.error('Error saving offer image to DB:', err);
    res.status(500).json({ error: 'Failed to save image to database' });
  }
});

module.exports = router;
