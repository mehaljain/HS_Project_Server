const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const HaircareProduct = require('../models/HaircareProduct');
const SkincareProduct = require('../models/SkincareProduct');

// Multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only jpg, jpeg, png files are allowed'));
    }
  }
});

// POST /api/upload?productId=xxx&type=haircare|skincare
router.post('/', upload.array('images', 10), async (req, res) => {
  const { productId, type } = req.query;
  const conn = mongoose.connection;
  const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'images' });
  let fileIds = [];
  let filesMeta = [];
  try {
    for (const file of req.files) {
      const uploadStream = bucket.openUploadStream(Date.now() + '-' + file.originalname, {
        contentType: file.mimetype,
      });
      uploadStream.end(file.buffer);
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          fileIds.push(uploadStream.id);
          filesMeta.push({ id: uploadStream.id, filename: uploadStream.filename, contentType: uploadStream.options.contentType });
          resolve();
        });
        uploadStream.on('error', reject);
      });
    }
    let updated = null;
    if (productId && type) {
      if (type === 'haircare') {
        updated = await HaircareProduct.findByIdAndUpdate(productId, { $push: { images: { $each: fileIds } } }, { new: true });
      } else if (type === 'skincare') {
        updated = await SkincareProduct.findByIdAndUpdate(productId, { $push: { images: { $each: fileIds } } }, { new: true });
      }
    }
    res.json({ files: filesMeta, updated });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

module.exports = router;
