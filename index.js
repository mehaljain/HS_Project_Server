// const imageListRoutes = require('./routes/imageListRoutes');
// const imageRoutes = require('./routes/imageRoutes');
// const offerImagesRoutes = require('./routes/offerImages');
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const app = express();

// dotenv.config();
// app.use(express.json());
// const allowedOrigins = [
//   "https://client-q5dl.onrender.com",
//   "https://admin-client-wbes.onrender.com", 
//   "http://localhost:3000", 
//   "http://localhost:3001"           
// ];

// app.use(cors({
//   origin: function(origin, callback){

//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));

// app.use('/uploads', express.static('uploads'));
// app.use('/api/offers/images', offerImagesRoutes);
// app.use('/api/image', imageRoutes);
// app.use('/api/image/list', imageListRoutes);

// const haircareRoutes = require('./routes/haircareRoutes');
// app.use('/api/haircare', haircareRoutes);

// const skincareRoutes = require('./routes/skincareRoutes');
// app.use('/api/skincare', skincareRoutes);

// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

// const adminRoutes = require('./routes/adminRoutes');
// app.use('/api/admin', adminRoutes);

// const uploadRoutes = require('./routes/uploadRoutes');
// app.use('/api/upload', uploadRoutes);

// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// const offersRoutes = require('./routes/offers');
// app.use('/api/offers', offersRoutes);

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB Atlas connected'))
// .catch((err) => console.error('MongoDB connection error:', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://client-q5dl.onrender.com",
  "https://admin-client-wbes.onrender.com",
  "http://localhost:3000", 
  "http://localhost:3001"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200 
}));

app.use('/uploads', express.static('uploads'));

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
// Mount image list router at base; it defines its own subpath(s)
app.use('/api/image', imageListRoutes);
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
