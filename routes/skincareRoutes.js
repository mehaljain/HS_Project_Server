const express = require('express');
const router = express.Router();
const skincareController = require('../controllers/skincareController');

router.get('/', skincareController.getSkincareProducts);
router.get('/:id', skincareController.getSkincareProductById);
router.post('/', skincareController.createSkincareProduct);
router.put('/:id', skincareController.updateSkincareProduct);
router.delete('/:id', skincareController.deleteSkincareProduct);

module.exports = router;
