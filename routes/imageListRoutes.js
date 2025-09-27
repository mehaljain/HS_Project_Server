const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const router = express.Router();

// GET /api/image/list - list all GridFS image IDs
router.get('/list', async (req, res) => {
  try {
    const conn = mongoose.connection;
    const gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');
    const files = await gfs.files.find({}).toArray();
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list images' });
  }
});

module.exports = router;
