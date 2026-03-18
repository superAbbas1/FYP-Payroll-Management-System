const mongoose = require('mongoose');

const SalaryRecordSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
  },
  joiningDate: { 
    type: Date,
    required: true,
  },
});


const SalaryRecord = mongoose.model('SalaryRecord', SalaryRecordSchema);
module.exports = SalaryRecord;