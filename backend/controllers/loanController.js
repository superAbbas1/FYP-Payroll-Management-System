const User = require('../db/User');
const LoanRequest = require('../db/LoanRequests');
const { generateProvidentFundHistory } = require('../utils/helpers');

/**
 * Get all loan requests
 */
exports.getAllLoans = async (req, res) => {
  try {
    const loanRequests = await LoanRequest.find();
    res.json(loanRequests);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

/**
 * Update loan request status
 */
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    if (!['Approved', 'Declined', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid loan status' });
    }

    const loanRequest = await LoanRequest.findById(requestId);
    if (!loanRequest) {
      return res.status(404).json({ message: 'Loan request not found' });
    }

    const user = await User.findOne({ 'loanHistory._id': requestId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const loan = user.loanHistory.id(requestId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan history entry not found' });
    }

    const previousStatus = loan.status;
    const loanAmount = Number(loan.amount ?? loanRequest.loanAmount);

    if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
      return res.status(400).json({ message: 'Invalid loan amount' });
    }

    const generatedHistory = generateProvidentFundHistory(user.joining, user.salaryHistory);
    user.providentFund.history = generatedHistory;

    if (status === 'Approved' && previousStatus !== 'Approved') {
      const currentBalance = Number(user.providentFund.balance) || 0;

      if (loanAmount > currentBalance) {
        return res.status(400).json({ message: 'Insufficient provident fund balance' });
      }

      user.providentFund.balance = currentBalance - loanAmount;
    }

    loan.status = status;
    loanRequest.status = status;

    loan.remainingBalance = user.providentFund.balance;

    await user.save();
    await loanRequest.save();

    res.status(200).json({
      message: `Loan Request status: ${status}`,
      providentFundBalance: user.providentFund.balance
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to update the loan request status `, error: error.message });
  }
};

/**
 * Create new loan request
 */
exports.createLoanRequest = async (req, res) => {
  try {
    const { employeeID, loanAmount } = req.body;
    const user = await User.findOne({ employeeID });

    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const availableBalance = Number(user.providentFund.balance) || 0;

    if (parseInt(loanAmount) > availableBalance) {
      return res.status(400).json({ error: "Insufficient provident fund balance" });
    }

    user.providentFund.history = generateProvidentFundHistory(user.joining, user.salaryHistory);

    const newLoanRequest = new LoanRequest({
      employeeId: user.employeeID,
      employeeName: `${user.fname} ${user.lname}`,
      loanAmount: loanAmount,
      loanDate: new Date(),
      status: 'Pending',
    });

    const savedLoanRequest = await newLoanRequest.save();

    user.loanHistory.push({
      _id: savedLoanRequest._id,
      amount: loanAmount,
      date: new Date(),
      status: 'Pending',
    });
    await user.save();

    res.status(201).json({ message: "Loan request created successfully", newLoanRequest });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get loan requests for specific employee
 */
exports.getEmployeeLoanRequests = async (req, res) => {
  try {
    const { employeeID } = req.params;
    const user = await User.findOne({ employeeID: employeeID });
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(user.loanHistory);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete loan request by employee
 */
exports.deleteLoanRequest = async (req, res) => {
  try {
    const { requestId, employeeID } = req.params;

    const user = await User.findOne({ employeeID });
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const loanRequestIndex = user.loanHistory.findIndex(request => request._id.toString() === requestId);

    if (loanRequestIndex === -1) {
      return res.status(404).json({ error: "Loan request not found" });
    }

    user.loanHistory.splice(loanRequestIndex, 1);
    await user.save();

    res.status(200).json({ message: "Loan request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete loan request by admin
 */
exports.deleteLoanRequestAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await LoanRequest.findByIdAndDelete(id);
    res.status(200).json({ message: 'Loan Request Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Loan Request could not deleted' });
  }
};
