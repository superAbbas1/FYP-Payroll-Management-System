const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: 'abbasmansoor456@gmail.com',
    pass: 'piyt nnxe xuux lwzb'
  }
});

/**
 * Send email to user
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 */
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: '"Payroll Management System" <abbasmansoor456@gmail.com>',
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate Provident Fund history from joining date to today
 * Creates an entry for each month from joining date
 * Applies salary changes based on salary history
 * 
 * @param {Date} joiningDate - Employee joining date
 * @param {Array} salaryHistory - Array of {month, salary} objects
 * @returns {Array} Array of {month, amount} objects
 */
const generateProvidentFundHistory = (joiningDate, salaryHistory) => {
  const pfHistory = [];
  
  // Parse joining date
  const joining = new Date(joiningDate);
  const joinYear = joining.getFullYear();
  const joinMonth = joining.getMonth();
  
  // Current date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Generate months from joining date to current month
  let date = new Date(joinYear, joinMonth);
  
  while (date <= today) {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const monthYear = `${month} ${year}`;
    
    // Find salary for this month
    let monthlySalary = 0;
    for (let i = salaryHistory.length - 1; i >= 0; i--) {
      const histEntry = salaryHistory[i];
      const [histMonth, histYear] = histEntry.month.split(' ');
      const histDate = new Date(`${histMonth} 1, ${histYear}`);
      
      if (histDate <= date) {
        monthlySalary = parseFloat(histEntry.salary);
        break;
      }
    }
    
    // Calculate 10% PF
    const pfAmount = monthlySalary * 0.1;
    
    // Check if this month already exists in pfHistory
    const existingIndex = pfHistory.findIndex(entry => entry.month === monthYear);
    if (existingIndex === -1) {
      pfHistory.push({
        month: monthYear,
        amount: pfAmount
      });
    }
    
    // Move to next month
    date.setMonth(date.getMonth() + 1);
  }
  
  return pfHistory;
};

module.exports = {
  sendEmail,
  generateProvidentFundHistory,
  transporter
};
