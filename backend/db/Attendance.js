const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    ref: 'Employee',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
    default: 'Absent'
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  }
});

const AttendanceHistory = mongoose.model('AttendanceHistory', attendanceSchema);

module.exports = AttendanceHistory;
