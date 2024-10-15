// // Employee schema

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: false,
    },
  });
  
  // Employee model
  module.exports = mongoose.model('Employee', employeeSchema);