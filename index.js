// Image list route for debugging
const imageListRoutes = require('./routes/imageListRoutes');


const imageRoutes = require('./routes/imageRoutes');
const offerImagesRoutes = require('./routes/offerImages');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));
app.use('/api/offers/images', offerImagesRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/image/list', imageListRoutes);


// Haircare product routes
const haircareRoutes = require('./routes/haircareRoutes');
app.use('/api/haircare', haircareRoutes);

// Skincare product routes
const skincareRoutes = require('./routes/skincareRoutes');
app.use('/api/skincare', skincareRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Upload routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});
// Offers routes
const offersRoutes = require('./routes/offers');
app.use('/api/offers', offersRoutes);
// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
