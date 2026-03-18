require('dotenv').config();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas using MONGO_URI from .env
// MongoDB driver 4.0+ doesn't need useNewUrlParser or useUnifiedTopology
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    // Import and start the app AFTER MongoDB is connected
    const app = require('./index');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('📝 Troubleshooting:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MongoDB Atlas IP whitelist includes your IP');
    console.log('3. Check .env file has correct MONGO_URI');
    console.log('4. Ensure MongoDB Atlas cluster is running');
    process.exit(1);
  });
