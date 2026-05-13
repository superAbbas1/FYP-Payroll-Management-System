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

// Import models
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
app.use('/api', userRoutes);
// Backward compatibility for legacy frontend calls without /api prefix.
app.use('/', userRoutes);
app.use('/', attendanceRoutes);
app.use('/', salaryRoutes);
app.use('/', pfRoutes);
app.use('/', loanRoutes);
app.use('/', leaveRoutes);
app.use('/', departmentRoutes);

// ========================================
// SCHEDULED TASKS (CRON JOBS)
// ========================================
cron.schedule('59 23 * * *', async () => {
  console.log('Running scheduled auto-mark absent job...');
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const allEmployees = await User.find({}, 'employeeID _id');
    let absentsMarked = 0;

    for (const employee of allEmployees) {
      const existingAttendance = await AttendanceHistory.findOne({
        employeeId: employee.employeeID,
        date: formattedDate
      });

      if (!existingAttendance) {
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

    console.log(`Auto-mark absent completed: ${absentsMarked} absences marked on ${formattedDate}`);
  } catch (error) {
    console.error('Error in auto-mark absent scheduled job:', error);
  }
});

// ========================================
// SERVER STARTUP
// ========================================
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
  console.log('All routes loaded');
  console.log('Cron jobs initialized');
});
