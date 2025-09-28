const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Allowed origins (frontend URLs)
const allowedOrigins = [
  "https://client-q5dl.onrender.com",
  "https://admin-client-wbes.onrender.com",
  "http://localhost:3000", 
  "http://localhost:3001"
];

// Simplified CORS middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200 // fixes preflight (OPTIONS) errors
}));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
const imageListRoutes = require('./routes/imageListRoutes');
const imageRoutes = require('./routes/imageRoutes');
const offerImagesRoutes = require('./routes/offerImages');
const haircareRoutes = require('./routes/haircareRoutes');
const skincareRoutes = require('./routes/skincareRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const offersRoutes = require('./routes/offers');

// Route mapping
app.use('/api/offers/images', offerImagesRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/image/list', imageListRoutes);
app.use('/api/haircare', haircareRoutes);
app.use('/api/skincare', skincareRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/offers', offersRoutes);

// Basic root
app.get('/', (req, res) => res.send('API is running...'));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
