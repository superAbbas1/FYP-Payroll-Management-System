const User = require('../db/User');
const Department = require('../db/Department');
const { sendEmail, generateProvidentFundHistory } = require('../utils/helpers');

/**
 * Get user by ID or employeeID
 */
exports.getUserProfile = async (req, res) => {
  console.log('Received request for employeeID:');
  const { employeeID } = req.params;
   
  try {
    console.log('Fetching user profile for:', employeeID);
    
    // Try finding by employeeID first (string field)
    let user = await User.findOne({ employeeID: employeeID });
    
    // If not found, try by MongoDB _id (in case old code sent _id)
    if (!user) {
      console.log('Not found by employeeID, trying _id');
      user = await User.findById(employeeID);
    }
    
    if (!user) {
      console.log('User not found:', employeeID);
      return res.status(404).json({ error: 'Employee not found.' });
    }
    
    console.log('User found:', user.fname, user.lname);
    res.status(200).json({
      _id: user._id,
      employeeID: user.employeeID,
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
      email: user.email,
      status: user.status
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user information.' });
  }
};

/**
 * Get user salary by ID
 */
exports.getUserSalary = async (req, res) => {
  const { employeeID } = req.params;
  try {
    const user = await User.findOne({ employeeID: employeeID });
    
    if (!user) {
      return res.status(404).json({ error: 'Employee not found.' });
      
    }
    res.status(200).json({ salary: user.salary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary information.' });
  }
};

/**
 * Update user password
 */
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const {id} = req.params;
  console.log('Password update request received for user ID:', req.params.id);
  try {
    console.log('Fetching userrrrr for password update');
    const user = await User.findOne({ employeeID: id });
    console.log('Userrrrrr fetched:', user ? user.email : 'User not found');
    if (!user) {
      return res.status(404).send('User not found');
    }
 
    user.password = newPassword;
    await user.save();

    res.send('Password updated successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

/**
 * Validate user password
 */
exports.validatePassword = async (req, res) => {
  const { currentPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).send('Incorrect password');

    res.send('Password is valid');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

/**
 * Register new employee
 */
exports.registerEmployee = async (req, res) => {
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

    // Get the current month and year
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    // Create new user
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

      salaryHistory: [
        {
          salary: req.body.salary,
          month: `${currentMonth} ${currentYear}`
        }
      ]
    });

    // Generate PF history from joining date
    const salaryHistoryForPF = newUser.salaryHistory;
    newUser.providentFund.history = generateProvidentFundHistory(newUser.joining, salaryHistoryForPF);
    
    // Calculate total PF balance and SAVE it
    newUser.providentFund.balance = newUser.providentFund.history.reduce((sum, entry) => sum + entry.amount, 0);

    await newUser.save();

    const decryptedPassword = newUser.decryptPassword();

    // Send welcome email
    const emailText = `Dear ${newUser.fname} ${newUser.lname},

We are thrilled to welcome you to [Company Name] as our new ${newUser.designation}. Your monthly salary is ${newUser.salary}.

Your Payroll Management System account has been created:

- Email: ${newUser.email}
- Password: ${decryptedPassword}
- Employee ID: ${newUser.employeeID}

Please log in and update your password.

Best regards,  
Payroll Management System Team`;

    await sendEmail(newUser.email, 'Account Credentials', emailText);

    res.status(201).json({
      message: "User registered and credentials emailed successfully.",
      employeeID: newUser.employeeID
    });

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `Duplicate value for field: ${field}` });
    }
    res.status(500).json({ error: "Failed to register user." });
  }
};

/**
 * Login user
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Check if admin credentials
    if (email === "admin" && password === "acbd1324") {
      console.log('Admin login successful');
      return res.status(200).json({
        message: "Login successful",
        user: {
          email: "admin",
          role: "admin",
        },
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('Login attempt for email:', email);

    if (user) {
      const decryptedPassword = user.decryptPassword();
      if (password === decryptedPassword) {
        // Send login notification email
//         const emailText = `Dear ${user.fname} ${user.lname},

// We wanted to notify you that your account was logged in on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.

// If you did not initiate this login, we strongly recommend that you change your password immediately to secure your account.

// Should you have any concerns or need assistance, please do not hesitate to contact our support team.

// Best regards,  
// Payroll Management System Team`;

//         await sendEmail(user.email, 'Security Alert: Account Login Notification', emailText);

        return res.status(200).json({
          message: "Login successful",
          user: {
            email: user.email,
            role: user.role,
            employeeId: user.employeeID || user._id.toString(),
          },
        });
      }
    }

    // If credentials don't match
    res.status(401).json({ error: "Invalid email or password" });
  } catch (err) {
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 * Forgot password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "No account exists with this email" });
    }

    const decryptedPassword = user.decryptPassword();

    const emailText = `Hello,
    
We received a request to recover your password. Your current password is: ${decryptedPassword}

If you did not request this, please contact our support team.

Best regards,
Payroll Management System Team`;

    await sendEmail(user.email, 'Your Password Recovery Information', emailText);

    res.send({ message: "Your password has been sent to your email" });
  } catch (err) {
    res.status(500).send({ error: "Failed to process forgot password request" });
  }
};

/**
 * Update employee
 */
exports.updateEmployee = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ error: 'Employee not found' });
    }
    res.send(updatedUser);
  } catch (err) {
    res.status(500).send({ error: 'Failed to update employee' });
  }
};


/**
 * Get employees list with filters
 */
exports.getEmployeesList = async (req, res) => {
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
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

/**
 * Get distinct departments
 */
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};

/**
 * Get employee by ID
 */
exports.getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ employeeID: id });
    console.log('Employee fffffetched:', user);
    if (!user) return res.status(404).send('User not found');
    res.json(user.password);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

/**
 * Delete employee
 */
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await User.findByIdAndDelete(id);
    if (employee) {
      res.status(200).send({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).send({ message: 'Employee not found' });
    }
  } catch (err) {
    res.status(500).send({ error: "Failed to delete employee" });
  }
};
