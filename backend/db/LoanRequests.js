const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanRequestsSchema = new Schema({
    employeeId : { type: String, required: true},
    employeeName : { type: String, required: true},
    date: { type: Date, required: true },
    status: { type: String, default: 'Pending' }
});

const LoanRequests = mongoose.model('LoanRequests', loanRequestsSchema);
module.exports = LoanRequests;