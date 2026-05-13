require('dotenv').config();
const mongoose = require('mongoose');

const localMongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee';

// Start API server in localhost-only mode even if MongoDB is temporarily down.
mongoose.connect(localMongoUri)
  .then(() => {
    console.log('MongoDB connected');
    require('./index');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Starting backend without DB connection (localhost mode).');
    console.log('Troubleshooting (local MongoDB):');
    console.log('1. Ensure MongoDB service is running on your machine');
    console.log('2. Verify MONGO_URI in backend/.env points to localhost');
    console.log('3. Check port 27017 is available');
    require('./index');
  });
