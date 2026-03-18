const User = require('../db/User');
const SalaryRecord = require('../db/Salary');
const { generateProvidentFundHistory } = require('../utils/helpers');

/**
 * Update employee salary and recalculate PF
 */
exports.updateSalary = async (req, res) => {
  const { employeeID, salary } = req.body;

  if (!employeeID || !salary) {
    return res.status(400).json({ error: 'Employee ID and salary are required.' });
  }
  try {
    const user = await User.findById(employeeID);
    if (!user) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    
    const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const existingEntryIndex = user.salaryHistory.findIndex(entry => entry.month === nextMonth);

    if (existingEntryIndex !== -1) {
      user.salaryHistory[existingEntryIndex].salary = salary;
    } else {
      user.salaryHistory.push({ salary: salary, month: `${nextMonth} ${currentYear}` });
    }
    user.salary = salary;
    
    // Regenerate PF history with new salary and SAVE it
    user.providentFund.history = generateProvidentFundHistory(user.joining, user.salaryHistory);
    
    // Recalculate total balance and SAVE it
    user.providentFund.balance = user.providentFund.history.reduce((sum, entry) => sum + entry.amount, 0);
    
    await user.save();
    res.status(200).json({
      message: `Salary updated to ${salary} successfully for ${nextMonth}. Provident fund recalculated.`,
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update salary' });
  }
};

/**
 * Get employee salary
 */
exports.getSalary = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const user = await User.findOne({ employeeID: employeeId });
    if (!user) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    res.json({ salary: user.salary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary' });
  }
};

/**
 * Get salary change history
 */
exports.getSalaryChanges = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const salaryRecord = await SalaryRecord.findOne({ employeeId });

    if (!salaryRecord) {
      return res.status(404).json({ error: 'Salary record not found.' });
    }

    res.json({ salaryChanges: salaryRecord.history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary change history' });
  }
};

/**
 * Get all salary records for an employee
 */
exports.getAllSalaryRecords = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const user = await User.findOne({ employeeID: employeeId });
    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const salaryRecords = user.salaryHistory;

    if (!salaryRecords || salaryRecords.length === 0) {
      return res.status(404).json({ error: 'No salary records found' });
    }

    res.json(salaryRecords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary records' });
  }
};
