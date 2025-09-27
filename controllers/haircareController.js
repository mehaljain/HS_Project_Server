const HaircareProduct = require('../models/HaircareProduct');

exports.getHaircareProducts = async (req, res) => {
  try {
    const products = await HaircareProduct.find({});
    // Ensure oldPrice and offer are always present in response
    const productsWithOffer = products.map(p => ({
      ...p.toObject(),
      oldPrice: p.oldPrice || null,
      offer: p.offer || null
    }));
    res.json(productsWithOffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHaircareProductById = async (req, res) => {
  try {
    const product = await HaircareProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product) {
      const prodObj = {
        ...product.toObject(),
        oldPrice: product.oldPrice || null,
        offer: product.offer || null
      };
      res.json(prodObj);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHaircareProduct = async (req, res) => {
  try {
    const product = new HaircareProduct(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateHaircareProduct = async (req, res) => {
  try {
    const product = await HaircareProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Only set originalPrice if not already present and provided in body
    if (!product.originalPrice && req.body.originalPrice) {
      product.originalPrice = req.body.originalPrice;
    }

    // If offer is present in body, always apply discount to originalPrice
    if (req.body.offer !== undefined) {
      const discountValue = Number(req.body.offer);
      const base = product.originalPrice || product.price;
      const discountedPrice = base - (base * discountValue / 100);
      product.oldPrice = base;
      product.price = discountedPrice;
      product.offer = discountValue;
    } else {
      // Otherwise, update other fields as usual
      Object.assign(product, req.body);
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteHaircareProduct = async (req, res) => {
  try {
    const product = await HaircareProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
