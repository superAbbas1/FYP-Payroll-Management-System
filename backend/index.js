const express = require('express');
const cors = require('cors');
require('./db/config');

const crypto = require("crypto-js");


const User = require('./db/User');
const Department = require('./db/Department')
const SalaryRecord = require("./db/Salary");
const nodemailer = require('nodemailer');
const Attendance = require("./db/Attendance");
const LeaveRequest = require("./db/LeaveRequest");
const providentFundRoutes = require('./db/User');
const loanRequestRoutes = require('./db/User');

// index.js
// const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());



//////changing password //////////////

// Get User Information
app.get('/api/employees/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});





//////// Update User Password
app.put('/api/employees/:id/updatePassword', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.password = newPassword;
    await user.save();

    res.send('Password updated successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});



// Validate Current Password
app.post('/api/users/:id/validate-password', async (req, res) => {
  const { currentPassword } = req.body;

  console.log("current password: ", currentPassword);

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).send('Incorrect password');

    res.send('Password is valid');
  } catch (error) {
    res.status(500).send('Server error');
  }
});





//////new one

app.get('/api/loans', async (req, res) => {
  try {
    const users = await User.find({ 'loanHistory': { $exists: true } });

    // Filter out users without valid loan requests
    const loanRequests = users.flatMap(user =>
      user.loanHistory
        .filter(loan => loan.amount && loan.date) // Only consider valid loans
        .map(loan => ({
          _id: user._id,
          employeeName: `${user.fname} ${user.lname}`,
          employeeID: user.employeeID,
          amount: loan.amount,
          date: loan.date,
          approved: loan.approved
        }))
    );

    res.json(loanRequests);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});




// Update loan request status
app.put('/api/loans/:id', async (req, res) => {
  try {
    const { approved } = req.body;

    // Find the loan request
    const user = await User.findOne({ _id: req.params.id, 'loanHistory.0': { $exists: true } });

    if (!user) {
      return res.status(404).send('User or loan request not found');
    }

    const loanRequest = user.loanHistory[0]; // Assuming the loan request is the first one in the history

    if (approved && !loanRequest.approved) {  // Only subtract if it's being approved for the first time
      const loanAmount = loanRequest.amount; // The requested loan amount
      user.providentFund.balance -= loanAmount; // Subtract the loan amount from the provident fund balance
    }

    // Update the loan approval status
    await User.updateOne(
      { _id: req.params.id, 'loanHistory.0': { $exists: true } },
      {
        $set: { 'loanHistory.0.approved': approved, 'providentFund.balance': user.providentFund.balance }
      }
    );

    res.send('Loan status updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});



///////////////////////                                     ///////////////////////
////                                      leave request
///////////////////////                                      ///////////////////////

// POST /api/leaves

// POST /api/leaves
app.post('/api/leaves', async (req, res) => {
  try {
    const { employeeId, subject, startDate, endDate, status } = req.body;
    console.log('employee id: ', employeeId);

    // Validate date order
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Starting date must be before the ending date' });
    }

    // Fetch the user to get the employeeID
    const user = await User.findById(employeeId);
    console.log('user ', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("emp id: ", user.employeeID);

    const newLeaveRequest = new LeaveRequest({
      employeeId: user.employeeID,
      employeeName: `${user.fname} ${user.lname}`,
      subject,
      startDate,
      endDate,
      status,
    });

    const savedLeaveRequest = await newLeaveRequest.save();

    // Also push to user's leaveRequestsHistory
    user.leaveRequestsHistory.push({
      _id: savedLeaveRequest._id,
      subject,
      startDate,
      endDate,
      status
    });
    await user.save();
    // Include employeeID in the response
    res.status(201).json({ ...savedLeaveRequest.toObject(), employeeID: user.employeeID });
  } catch (error) {
    console.error('Error saving leave request:', error);
    res.status(500).json({ message: 'Failed to submit leave request', error: error.message });
  }
});



app.get('/api/leaves', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leave requests', error: error.message });
  }
});

app.get('/api/leaves/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const user = await User.findById(employeeId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      leaveRequestsHistory: user.leaveRequestsHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests' });
  }
});

// Get leave requests for a specific employee
// app.get('/leaves/:employeeId', async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const leaves = await Leave.find({ employeeId });
//     if (!leaves) {
//       return res.status(404).json({ message: 'No leaves found for this employee' });
//     }
//     res.status(200).json(leaves);
//   } catch (error) {
//     console.error('Error fetching leave requests:', error);
//     res.status(500).json({ message: 'Failed to fetch leave requests' });
//   }
// });

app.put('/api/leaves/:id', async (req, res) => {
  try {
    const { status, id } = req.body;
    console.log('id : ', id, 'status: ', status);
    const user = await User.findOne({ 'leaveRequestsHistory._id': id });
    await LeaveRequest.findByIdAndUpdate(req.params.id, { status });
    const leave = user.leaveRequestsHistory.find(lr => lr._id.toString() === id);
    if (leave) {
      leave.status = status;
      await user.save();
      res.status(200).json({ message: `Leave request ${status.toLowerCase()} successfully` });
    } else {
      res.status(404).json({ message: 'Leave request not found in user history' });
    }
  } catch (error) {
    res.status(500).json({ message: `Failed to update leave request status`, error: error.message });
  }
});

// deleteing api by the employee side
app.delete('/api/leaves/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("document ki id: ", id);
    const { employeeId } = req.body;

    console.log('Deleting leave request with ID:', id, 'for employee ID:', employeeId);


    const user = await User.findById(employeeId);

    console.log('user found: ', user.employeeID);

    // Find and delete the leave request by ID and employee ID
    const index = await user.leaveRequestsHistory.findIndex(
      (leave) => leave._id.toString() === id
    );
    console.log('result: ', index);

    if (index !== -1) {
      user.leaveRequestsHistory.splice(index, 1);
      await user.save();
      res.status(200).json({ message: 'Leave request deleted successfully' });
    } else {
      res.status(404).json({ message: 'Leave request not found or does not belong to this employee' });
    }
  } catch (error) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({ message: 'Failed to delete leave request', error: error.message });
  }
});


// delete api by admin side
app.delete('/api/admin-leaves/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await LeaveRequest.findByIdAndDelete(id);
    // await LeaveRequest.save();
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({ message: 'Failed to delete leave request', error: error.message });
  }
});




///////////////employee side - employee information getting///////
/////////////////////////////////////////////////////////////////


//to get all informaiton of an employee///
app.get('/api/user/:employeeID', async (req, res) => {
  console.log("api woring ");
  const { employeeID } = req.params;
  console.log("emoployee ID: ", employeeID);

  try {
    // Find the user by employeeID
    const user = await User.findById(employeeID);
    if (!user) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Return the user data without sensitive information
    res.status(200).json({
      fname: user.fname,
      lname: user.lname,
      department: user.department,
      designation: user.designation,
      city: user.city,
      phoneNum: user.phoneNum,
      bankName: user.bankName,
      accountName: user.accountName,
      accountNum: user.accountNum,
      cnic: user.cnic,
      joining: user.joining,
      address: user.address,
      status: user.status
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user information.' });
  }
});



//to get salary info of an employee////
app.get('/api/user/salary/:employeeID', async (req, res) => {
  const { employeeID } = req.params;
  console.log("employeeID: ", employeeID);

  try {
    const user = await User.findById(employeeID); // Find by _id, as it matches the ObjectId
    console.log("user found: ", user);
    if (!user) {
      return res.status(404).json({ error: 'Employee not found.' });
    }


    res.status(200).json({ salary: user.salary });
  } catch (error) {
    console.error('Error fetching Salary info:', error);
    res.status(500).json({ error: 'Failed to fetch Salary information.' });
  }
});





app.get('/api/attendance', async (req, res) => {
  try {
    // Fetch all users and their attendance records
    const attendanceRecords = await User.find({}, 'employeeID fname lname department designation attendance');

    // Return the attendance records
    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});






//////////new apiu?///////////////



app.post('/api/attendance', async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    console.log("employee ID: ", employeeId, "date", date);

    // Parse the date and set it to the start of the day
    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0); // Set time to midnight

    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1; // Months are zero-indexed

    console.log("parsedDate: ", parsedDate);

    // Check if attendance for this employee and date already exists
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: parsedDate, // Start of the day
        $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000) // End of the day
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance for this date has already been marked.' });
    }

    // Create new attendance record
    const newAttendance = new Attendance({
      employeeId,
      date: parsedDate,
      status,
      year,
      month
    });

    const savedAttendance = await newAttendance.save();
    res.status(200).json({ message: 'Attendance marked successfully', attendance: savedAttendance });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
});




app.get('/api/attendance/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year, month } = req.query; // Expect year and month to be provided as query parameters

    let query = { employeeId };

    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);

    const attendanceRecords = await Attendance.find(query);
    res.status(200).json({ attendanceRecords });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ message: 'Failed to fetch attendance records', error: error.message });
  }
});


app.get('/api/adminattendance/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const { month, year } = req.query;

  try {
    const query = { employeeId };
    if (month) query.month = parseInt(month, 10);
    if (year) query.year = parseInt(year, 10);

    const records = await Attendance.find(query);
    res.json({ attendanceRecords: records });
  } catch (error) {
    console.error('Failed to fetch attendance records:', error);
    res.status(500).send('Server Error');
  }
});

// // Create a new salary record

app.post('/api/salary', async (req, res) => {
  console.log("Entered the /api/salary endpoint");
  const { employeeID, salary } = req.body;

  // Validate input
  if (!employeeID || !salary) {
    console.log('Invalid input:', { employeeID, salary });
    return res.status(400).json({ error: 'Employee ID and salary are required.' });
  }

  try {
    // Find the user by employeeID
    const user = await User.findById(employeeID);

    if (!user) {
      console.log("Employee not found");
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Get the current month and the next month
    const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    // Check if nextMonth already exists in salaryHistory
    const existingEntryIndex = user.salaryHistory.findIndex(entry => entry.month === nextMonth);

    if (existingEntryIndex !== -1) {
      // Update the existing entry
      user.salaryHistory[existingEntryIndex].salary = salary;
    } else {
      user.salaryHistory.push({ salary: salary, month: `${nextMonth} ${currentYear}` });
    }

    // Update the current salary
    user.salary = salary;

    // Save the updated user
    await user.save();

    console.log('Salary updated for user:', user);
    res.status(200).json({
      message: `Salary updated from ${user.salary} to ${salary} successfully for ${nextMonth}.`,
      user
    });
  } catch (error) {
    console.error('Error updating salary:', error);
    res.status(500).json({ error: 'Failed to update salary' });
  }
});



//////////update salary

// server.js or wherever you have defined your API routes

app.get('/api/salary/:employeeId', async (req, res) => {
  const { employeeId } = req.params; // Renamed to employeeId to represent _id
  console.log("employee _id in getting salary: ", employeeId);

  try {
    // Use findById to find the user based on the _id field
    const user = await User.findById(employeeId); // Using findById for _id
    console.log("User fetched: ", user);

    if (!user) {
      console.log("Employee not found");
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Return the salary of the employee
    res.json({ salary: user.salary });
    console.log("Salary: ", user.salary);

  } catch (error) {
    console.error('Error fetching salary:', error);
    res.status(500).json({ error: 'Failed to fetch salary' });
  }
});




/**** new api found */

app.get('/api/salary/changes/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const salaryRecord = await SalaryRecord.findOne({ employeeId });

    if (!salaryRecord) {
      return res.status(404).json({ error: 'Salary record not found.' });
    }

    // Respond with the salary history
    res.json({ salaryChanges: salaryRecord.history });
  } catch (error) {
    console.error('Error fetching salary change history:', error);
    res.status(500).json({ error: 'Failed to fetch salary change history' });
  }
});









// Get all salary records for an employee
app.get('/api/employees/:employeeId/salaries', async (req, res) => {
  const { employeeId } = req.params;

  try {
    console.log(`Fetching salary records for employee ID: ${employeeId}`);
    const user = await User.findById(employeeId);

    if (!user) {
      console.log(`No user found for employee ID: ${employeeId}`);
      return res.status(404).json({ error: 'Employee not found' });
    }

    const salaryRecords = user.salaryHistory;
    console.log("salary history: ", salaryRecords);

    if (!salaryRecords || salaryRecords.length === 0) {
      console.log(`No salary records found for employee ID: ${employeeId}`);
      return res.status(404).json({ error: 'No salary records found' });
    }

    res.json(salaryRecords);
  } catch (error) {
    console.error('Error fetching salary records:', error);
    res.status(500).json({ error: 'Failed to fetch salary records' });
  }
});










// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: 'abbasmansoor456@gmail.com',
    pass: 'piyt nnxe xuux lwzb'
  }
});





// Server-side registration handler


// Registration API


app.post("/register", async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Check if CNIC already exists
    const existingCnic = await User.findOne({ cnic: req.body.cnic });
    if (existingCnic) {
      return res.status(400).json({ error: "CNIC already in use" });
    }

    // Get department name from ID
    const department = await Department.findById(req.body.department);
    if (!department) {
      return res.status(400).json({ error: "Invalid department ID" });
    }

    const departmentName = department.name;

    // Calculate 10% provident fund deduction
    const salary = parseFloat(req.body.salary);
    const providentFundDeduction = salary * 0.1;

    // Get the current month and year
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    // Create new user without manually setting employeeID
    const newUser = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      department: departmentName,
      designation: req.body.designation,
      city: req.body.city,
      phoneNum: req.body.phoneNum,
      bankName: req.body.bankName,
      accountName: req.body.accountName,
      accountNum: req.body.accountNum,
      cnic: req.body.cnic,
      joining: req.body.joining,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      salary: req.body.salary,
      status: req.body.status,
      role: "employee",

      providentFund: {
        balance: providentFundDeduction,
        history: [
          {
            month: `${currentMonth} ${currentYear}`,
            amount: providentFundDeduction,
          }
        ]
      },

      salaryHistory: [
        {
          salary: req.body.salary,
          month: `${currentMonth} ${currentYear}`
        }
      ]
    });

    await newUser.save();

    console.log("simple password: ", newUser.password);
    const decryptedPassword = newUser.decryptPassword();
    console.log('password: ', decryptedPassword);

    const mailOptions = {
      from: '"Payroll Management System" <abbasmansoor456@gmail.com>',
      to: newUser.email,
      subject: 'Account Credentials',
      text: `Dear ${newUser.fname} ${newUser.lname},

We are thrilled to welcome you to [Company Name] as our new ${newUser.designation}. Your monthly salary is ${newUser.salary}.

Your Payroll Management System account has been created:

- Email: ${newUser.email}
- Password: ${decryptedPassword}
- Employee ID: ${newUser.employeeID}

Please log in and update your password.

Best regards,  
Payroll Management System Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('email not sent', newUser);
        return res.status(500).send({ error: "Failed to send email" });
      } else {
        res.status(201).json({

          message: "User registered and credentials emailed successfully.",
          employeeID: newUser.employeeID
        });
      }
    });

  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `Duplicate value for field: ${field}` });
    }
    res.status(500).json({ error: "Failed to register user." });
  }
});






/////////PF work regarding the emplpoyee ?///////////////


app.get('/provident-fund/:employeeID/:year', async (req, res) => {
  try {
    const { employeeID, year } = req.params;
    const user = await User.findById(employeeID);

    console.log('emp id: ', employeeID, "and year :", year);

    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const providentFundHistory = user.providentFund.history
      .filter(entry => entry.month && entry.month.includes(year))
      .map(entry => ({
        month: entry.month,
        amount: entry.amount,
        year: year
      }));

    const totalProvidentFundBalance = user.providentFund.balance;

    res.json({
      providentFundHistory,
      totalProvidentFundBalance,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve provident fund data' });
  }
});



app.get('/provident-fund/:employeeID', async (req, res) => {
  try {
    const { employeeID } = req.params;

    // Find the user by employeeID
    const user = await User.findById(employeeID);

    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Retrieve total provident fund balance and loan history
    const totalProvidentFund = user.providentFund.balance;
    const loanHistory = user.loanHistory;

    res.status(200).json({ totalProvidentFund, loanHistory });
  } catch (error) {
    console.error("Error fetching provident fund details:", error);
    res.status(500).json({ error: "Server error" });
  }
});




/////post loan request////////

// POST /api/loan-request
app.post('/api/loan-request', async (req, res) => {
  try {
    const { employeeID, loanAmount } = req.body;

    console.log("loan amoount: ", loanAmount, " employeeId: ", employeeID);

    // Find the user by employeeID
    const user = await User.findById(employeeID);

    if (!user) {
      console.log("ni mila brooo");
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if requested loan amount is within the available provident fund balance
    if (parseInt(loanAmount) > user.providentFund.balance) {
      return res.status(400).json({ error: "Insufficient provident fund balance" });
    }

    // Create a new loan request
    const newLoanRequest = {
      amount: loanAmount,
      date: new Date(),
      status: "Pending"
    };

    // Add the loan request to the loan history
    user.loanHistory.push(newLoanRequest);
    await user.save();

    res.status(201).json({ message: "Loan request created successfully", newLoanRequest });
  } catch (error) {
    console.error("Error creating loan request:", error);
    res.status(500).json({ error: "Server error" });
  }
});




/////api loan request//////////

app.get('/api/loan-requests/:employeeID', async (req, res) => {
  try {

    const { employeeID } = req.params;
    console.log("employe ID loan request wali: ", employeeID);
    const user = await User.findById(employeeID);

    if (!user) {
      console.log("emp ni milllllllllllll raha");
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(user.loanHistory);
  } catch (error) {
    console.error("Error fetching provident fund details:", error);
    res.status(500).json({ error: "Server error" });
  }
});



/////deletee PF history/////


// DELETE /api/loan-request/:requestId
app.delete('/api/to-delete-loan-request/:requestId/:employeeID', async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log("reqID :", requestId);
    const { employeeID } = req.params; // Use req.query to get the query parameter
    console.log("pehliii emp id: ", employeeID);


    // Find the user by employeeID
    const user = await User.findById(employeeID);

    console.log("employeeID: ", employeeID);

    if (!user) {
      console.log("Employee not found");
      return res.status(404).json({ error: "Employee not found" });
    }

    // Find the loan request by ID and remove it
    const loanRequestIndex = user.loanHistory.findIndex(request => request._id.toString() === requestId);

    if (loanRequestIndex === -1) {
      return res.status(404).json({ error: "Loan request not found" });
    }

    user.loanHistory.splice(loanRequestIndex, 1);
    await user.save();

    res.status(200).json({ message: "Loan request deleted successfully" });
  } catch (error) {
    console.error("Error deleting loan request:", error);
    res.status(500).json({ error: "Server error" });
  }
});








/////to update the register data
app.put('/employees/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ error: 'Employee not found' });
    }
    res.send(updatedUser);
  } catch (err) {
    res.status(500).send({ error: 'Failed to update employee' });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the credentials match the admin's hardcoded credentials
    if (email === "admin" && password === "acbd1324") {
      // If admin credentials match, return success with admin role
      return res.status(200).json({
        message: "Login successful",
        user: {
          email: "admin",
          role: "admin", // Include a unique identifier for admin (if applicable)
        },
      });
    }

    // Find the user by email in the database
    const user = await User.findOne({ email });
    console.log("email : ", email);

    if (user) {
      // Decrypt stored password and compare with input password
      console.log("User object:", user);
      console.log("Encrypted password from DB:", user.password);
      console.log("Type of password:", typeof user.password);
      const decryptedPassword = user.decryptPassword();
      console.log('decrypted password: ', decryptedPassword, "simple passsord: ", password);
      if (password === decryptedPassword) {
        console.log("asli emoloyee hau");
        const mailOptions = {
          from: '"Payroll Management System" <abbasmansoor456@gmail.com>', // Use a professional email address
          to: user.email,
          subject: 'Security Alert: Account Login Notification', // Improved subject line
          text: `Dear ${user.fname} ${user.lname},

We wanted to notify you that your account was logged in on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.

If you did not initiate this login, we strongly recommend that you change your password immediately to secure your account.

Should you have any concerns or need assistance, please do not hesitate to contact our support team.

Best regards,  
Payroll Management System Team

      `
        };


        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).send({ error: "Failed to send email" });
          } else {
            res.send({ message: "Your password has been sent to your email" });
          }
        });

        return res.status(200).json({
          message: "Login successful",
          user: {
            email: user.email,
            role: user.role,
            employeeId: user._id.toString(), // Include the user’s employee ID
          },
        });
      }
    }

    // If credentials don't match, send an error response
    res.status(401).json({ error: "Invalid email or password" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});


app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "No account exists with this email" });
    }

    // Decrypt the password
    const decryptedPassword = user.decryptPassword();

    // Send email with the decrypted password
    const mailOptions = {
      from: '"Payroll Management System" <abbasmansoor456@gmail.com>', // Use a professional email address
      to: user.email,
      subject: 'Your Password Recovery Information', // Improved subject line
      text: `Hello,
    
    We received a request to recover your password. Your current password is: ${decryptedPassword}
    
    If you did not request this, please contact our support team.
    
    Best regards,
    Payroll Management System Team`
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ error: "Failed to send email" });
      } else {
        res.send({ message: "Your password has been sent to your email" });
      }
    });
  } catch (err) {
    res.status(500).send({ error: "Failed to process forgot password request" });
  }
});




//jo gpt nay dya -->>>>>

app.post('/api/departments', async (req, res) => {
  try {
    const { name, description, designations } = req.body;
    const newDepartment = new Department({
      name,
      description,
      designations
    });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Failed to add department:', error);
    res.status(500).json({ error: 'Failed to add department' });
  }
});

// Route to fetch all departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Route to delete a department by ID
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (department) {
      res.json({ message: 'Department deleted successfully' });
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    console.error('Failed to delete department:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// Route to fetch all designations in a department
app.get('/api/departments/:id/designations', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (department) {
      res.json(department.designations);
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    console.error('Failed to fetch designations:', error);
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
});

// Route to fetch a department by ID
app.get('/api/departments/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    console.error('Failed to fetch department:', error);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

// Route to update a designation within a department
app.put('/api/departments/designations/:departmentId', async (req, res) => {
  const { departmentId } = req.params;
  const { oldDesignation, newDesignation } = req.body;

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const designationIndex = department.designations.indexOf(oldDesignation);
    if (designationIndex === -1) {
      return res.status(404).json({ message: 'Designation not found' });
    }

    department.designations[designationIndex] = newDesignation;
    await department.save();

    res.status(200).json(department);
  } catch (error) {
    console.error('Failed to update designation:', error);
    res.status(500).json({ message: 'Failed to update designation', error });
  }
});

// Route to update a department by ID
app.put('/api/departments/:id', async (req, res) => {
  try {
    const { name, description, designations } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, designations },
      { new: true }
    );
    if (!updatedDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(updatedDepartment);
  } catch (error) {
    console.error('Failed to update department:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
});



// API endpoint to fetch employees based on department and designation
app.get('/api/employees', async (req, res) => {
  const { departmentId, designation } = req.query; // Extracting query params

  try {
    // Check if departmentId is valid
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ error: 'Invalid department ID' });
    }

    // Convert departmentId to ObjectId for querying
    const departmentObjectId = mongoose.Types.ObjectId(departmentId);

    // Query to fetch employees based on department and designation
    const employees = await Employee.find({
      department: departmentObjectId,
      designation: designation,
    });

    // Check if employees are found
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    // Send employees data as JSON
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});


app.get('/employeeslist', async (req, res) => {
  try {

    const { year, month, department, designation } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }
    if (designation) {
      query.designation = designation;
    }
    if (year && month) {
      query['attendance.month'] = month;
    }

    const employees = await User.find(query);

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});


app.get("/departments", async (req, res) => {
  try {
    const departments = await User.distinct("department");
    res.json(departments.map((name, index) => ({ _id: index, name })));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});


app.get("/employees", async (req, res) => {
  try {
    let employees = await User.find();
    console.log("Employees fetched: ", employees);
    res.send(employees);
  } catch (err) {
    console.error("Failed to fetch employees: ", err);
    res.status(500).send({ error: "Failed to fetch employees" });
  }
});

app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await User.findByIdAndDelete(id);
    if (employee) {
      res.status(200).send({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).send({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error("Failed to delete employee: ", err);
    res.status(500).send({ error: "Failed to delete employee" });
  }
});

app.post("/attendance/:id", async (req, res) => {
  const { id } = req.params;
  const { month, dates } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Employee not found" });
    }

    const existingAttendance = user.attendance.find(a => a.month === month);
    if (existingAttendance) {
      existingAttendance.dates = dates;
    } else {
      user.attendance.push({ month, dates });
    }

    await user.save();
    res.status(200).send({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Failed to save attendance: ", error);
    res.status(500).send({ error: "Failed to save attendance" });
  }
});




app.listen(5000, () => {
  console.log("Server is running on port 5000");
});