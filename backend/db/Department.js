// db/Department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  designations: { type: [String], default: [] }
});

module.exports = mongoose.model('Department', departmentSchema);