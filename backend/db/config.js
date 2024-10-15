const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/employee")
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
