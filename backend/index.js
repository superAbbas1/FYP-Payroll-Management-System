const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

// Import routes
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const pfRoutes = require('./routes/pfRoutes');
const loanRoutes = require('./routes/loanRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

// Import utilities and models
const { sendEmail } = require('./utils/helpers');
const User = require('./db/User');
const AttendanceHistory = require('./db/Attendance');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ========================================
// API ROUTES
// ========================================

// User and Authentication routes
app.use('/api', userRoutes);

// Attendance routes
app.use('/', attendanceRoutes);

// Salary routes
app.use('/', salaryRoutes);

// Provident Fund routes
app.use('/', pfRoutes);

// Loan routes
app.use('/', loanRoutes);

// Leave routes
app.use('/', leaveRoutes);

// Department routes
app.use('/', departmentRoutes);

// ========================================
// SCHEDULED TASKS (CRON JOBS)
// ========================================

/**
 * Schedule auto-mark absent to run daily at 11:59 PM
 * The cron expression '59 23 * * *' means: at 23:59 (11:59 PM) every day
 */
cron.schedule('59 23 * * *', async () => {
  console.log('Running scheduled auto-mark absent job...');
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Get all employees
    const allEmployees = await User.find({}, 'employeeID _id');

    let absentsMarked = 0;

    for (const employee of allEmployees) {
      // Check if attendance is already marked for today
      const existingAttendance = await AttendanceHistory.findOne({
        employeeId: employee.employeeID,
        date: formattedDate
      });

      if (!existingAttendance) {
        // Mark as absent if not already marked
        const newAttendance = new AttendanceHistory({
          employeeId: employee.employeeID,
          date: formattedDate,
          status: 'Absent',
          year,
          month
        });
        await newAttendance.save();
        absentsMarked++;
      }
    }

    console.log(`✅ Auto-mark absent completed: ${absentsMarked} absences marked on ${formattedDate}`);
  } catch (error) {
    console.error('❌ Error in auto-mark absent scheduled job:', error);
  }
});

// ========================================
// SERVER STARTUP
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log('✅ All routes loaded');
  console.log('✅ Cron jobs initialized');
});
