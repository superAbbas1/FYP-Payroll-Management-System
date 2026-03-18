const User = require('../db/User');
const LoanRequest = require('../db/LoanRequests');

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
    const { amount, status, id } = req.body;

    await LoanRequest.findByIdAndUpdate(req.params.id, { status });

    const user = await User.findOne({ 'loanHistory._id': id });
    const loan = user.loanHistory.find(lh => lh._id.toString() === id);
    if (loan) {
      loan.status = status; 
      console.log(`Loan Request ${id} status updated to ${status}`);
      if (status === 'Approved') {
        console.log('preivous Provident Fund Balance:', user.providentFund.balance);
      user.providentFund.balance = user.providentFund.balance - amount;
      console.log(`Updated Provident Fund Balance for ${user.employeeID}:`, user.providentFund.balance);
      }
      else if (status === 'Declined') {
        console.log('Loan Declined. Provident Fund Balance remains unchanged:', user.providentFund.balance);
      }
      await user.save();
      res.status(200).json({ message: `Loan Request status: ${status}` });
    } else {
      res.status(500).json({ message: `User not found` });
    }
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
    if (parseInt(loanAmount) > user.providentFund.balance) {
      return res.status(400).json({ error: "Insufficient provident fund balance" });
    }

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
