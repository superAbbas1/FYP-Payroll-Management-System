const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveRequestSchema = new Schema({
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    subject: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: 'Pending' }
  });
  

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;