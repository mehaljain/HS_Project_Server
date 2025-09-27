// Image upload route
const uploadController = require('../controllers/uploadController');
const express = require('express');
const router = express.Router();
const haircareController = require('../controllers/haircareController');

router.get('/', haircareController.getHaircareProducts);
router.get('/:id', haircareController.getHaircareProductById);
router.post('/', haircareController.createHaircareProduct);
router.put('/:id', haircareController.updateHaircareProduct);
router.delete('/:id', haircareController.deleteHaircareProduct);

module.exports = router;
