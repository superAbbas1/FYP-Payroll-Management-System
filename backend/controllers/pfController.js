const User = require('../db/User');
const { generateProvidentFundHistory } = require('../utils/helpers');

/**
 * Get provident fund for specific year
 * Saves the generated history to database
 */
exports.getProvidentFundByYear = async (req, res) => {
  try { 
    const { employeeID, year } = req.params;
    
    // First try to find by MongoDB _id, if that fails, find by employeeID string
    let user = await User.findOne({ employeeID: employeeID });
    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Regenerate PF history to ensure all months are included
    const generatedHistory = generateProvidentFundHistory(user.joining, user.salaryHistory);
    
    // SAVE the generated history to database
    user.providentFund.history = generatedHistory;
    user.providentFund.balance = generatedHistory.reduce((sum, entry) => sum + entry.amount, 0);
    await user.save();
    
    // Filter by selected year
    const providentFundHistory = generatedHistory
      .filter(entry => entry.month && entry.month.includes(year))
      .map(entry => ({
        month: entry.month,
        amount: entry.amount,
        year: year
      }));

    const totalProvidentFundBalance = generatedHistory.reduce((sum, entry) => sum + entry.amount, 0);

    res.json({
      providentFundHistory,
      totalProvidentFundBalance,
      allHistory: generatedHistory  // Send full history so frontend can extract years
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve provident fund data' });
  }
};

/**
 * Get total provident fund and loan history
 * Saves the generated history to database
 */
exports.getProvidentFund = async (req, res) => {
  try {
    const { employeeID } = req.params;

    // First try to find by MongoDB _id, if that fails, find by employeeID string
    let user = await User.findOne({ employeeID: employeeID });

    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Regenerate PF history to ensure latest data
    const generatedHistory = generateProvidentFundHistory(user.joining, user.salaryHistory);
    
    // SAVE the generated history to database
    user.providentFund.history = generatedHistory;
    // user.providentFund.balance = generatedHistory.reduce((sum, entry) => sum + entry.amount, 0);
    await user.save();

    // const totalProvidentFund = generatedHistory.reduce((sum, entry) => sum + entry.amount, 0);
    const totalProvidentFund = user.providentFund.balance; // Use saved balance for consistency
    console.log("Total Provident Fund Balance:", totalProvidentFund);
    const loanHistory = user.loanHistory;

    res.status(200).json({ 
      totalProvidentFund, 
      loanHistory,
      providentFundHistory: generatedHistory  // Send full history for frontend
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Save PF record manually (if needed)
 * This ensures data persistence
 */
exports.savePFRecord = async (req, res) => {
  try {
    const { employeeID } = req.params;

    let user = await User.findOne({ employeeID: employeeID });

    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Regenerate and save
    const generatedHistory = generateProvidentFundHistory(user.joining, user.salaryHistory);
    user.providentFund.history = generatedHistory;
    user.providentFund.balance = generatedHistory.reduce((sum, entry) => sum + entry.amount, 0);
    await user.save();

    res.status(200).json({
      message: "Provident fund records saved successfully",
      history: generatedHistory,
      balance: user.providentFund.balance
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save provident fund records", details: error.message });
  }
};
