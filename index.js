// Image list route for debugging
const imageListRoutes = require('./routes/imageListRoutes');
const imageRoutes = require('./routes/imageRoutes');
const offerImagesRoutes = require('./routes/offerImages');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(express.json());
const allowedOrigins = [
  "https://client-q5dl.onrender.com",
  "https://admin-client-wbes.onrender.com", // your deployed frontend
  "http://localhost:3000", 
  "http://localhost:3001"           // optional, for local dev
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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
