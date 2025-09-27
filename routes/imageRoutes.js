// routes/imageRoutes.js
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const conn = mongoose.connection;

// helper: find file doc in a given bucket (bucketName => bucketName.files collection)
async function findFileInBucket(db, bucketName, idObj) {
  try {
    const coll = db.collection(`${bucketName}.files`);
    return await coll.findOne({ _id: idObj });
  } catch (err) {
    // if collection doesn't exist or other error, just return null
    return null;
  }
}

router.get('/:id', async (req, res) => {
  try {
    if (!conn || !conn.db) {
      console.error('GridFS not ready - conn.db missing');
      return res.status(503).send('Storage not ready');
    }

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid image id');
    }

    // IMPORTANT: construct ObjectId with new
    const _id = new mongoose.Types.ObjectId(id);

    // Try a few common bucket names (adjust if your upload uses a different bucket)
    const bucketCandidates = ['uploads', 'images', 'fs'];
    let foundFile = null;
    let foundBucket = null;

    for (const bucketName of bucketCandidates) {
      const file = await findFileInBucket(conn.db, bucketName, _id);
      if (file) {
        foundFile = file;
        foundBucket = bucketName;
        break;
      }
    }

    if (!foundFile) {
      console.warn(`Image ${id} not found in any bucket (${bucketCandidates.join(',')})`);
      return res.status(404).send('Image not found');
    }

    // Use contentType from file metadata if available
    const contentType = foundFile.contentType || (foundFile.metadata && foundFile.metadata.contentType) || 'application/octet-stream';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000');

    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: foundBucket });
    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on('error', (err) => {
      console.error('GridFS download error:', err);
      if (!res.headersSent) res.status(500).end('Error streaming file');
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error in /api/image/:id', err);
    if (!res.headersSent) res.status(500).send('Server error');
  }
});

module.exports = router;
