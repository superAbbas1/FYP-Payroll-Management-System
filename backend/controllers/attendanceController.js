const User = require('../db/User');
const AttendanceHistory = require('../db/Attendance');

/**
 * Get all attendance records
 */
exports.getAllAttendance = async (req, res) => { 
  try {
    const attendanceRecords = await User.find({}, 'employeeID fname lname department designation attendance');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

/**
 * Check if attendance marked for today
 */
exports.checkAttendanceToday = async (req, res) => {
  const { employeeId, date } = req.query;
  console.log('Checking attendance for employee:', employeeId, 'on date:', date);
  try {
    const user = await User.findOne({ employeeID: employeeId });
    const targetEmployee = user.employeeID;
    const targetAttendance = await AttendanceHistory.findOne({
      employeeId: targetEmployee,
      date: date
    });
    console.log('Found attendance record:', targetAttendance);
    if (date === targetAttendance?.date) {
      res.status(200).json({
        message: `Attendance is registered for date: ${date}`,
        attendanceMarked: true,
        status: targetAttendance.status
      })
    }
    else {
      res.status(200).json({
        message: `Attendance is not registered yet for date: ${date}`,
        attendanceMarked: false
      })
    }
  }
  catch {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

/**
 * Mark attendance - Creates a new attendance record
 */
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;
    console.log('Marking attendance for employee:', employeeId, 'on date:', date, 'with status:', status);

    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toISOString().slice(0, 10);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const user = await User.findOne({ employeeID: employeeId });

    // Check if already marked
    const existingAttendance = await AttendanceHistory.findOne({
      employeeId: user.employeeID,
      date: formattedDate
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const newAttendance = new AttendanceHistory({
      employeeId: user.employeeID,
      date: formattedDate,
      status: status,
      year,
      month
    });

    const savedAttendance = await newAttendance.save();
    res.status(200).json({ message: 'Attendance marked successfully', attendance: savedAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
};

/**
 * Get attendance for specific employee and month/year
 */
exports.getAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { targetYear, targetMonth } = req.query;

    const user = await User.findOne({ employeeID: employeeId });
    const targetUser = user.employeeID;

    const targetAttendanceRecord = await AttendanceHistory.find({
      employeeId: targetUser,
      month: targetMonth,
      year: targetYear
    });

    if (targetAttendanceRecord && targetAttendanceRecord.length > 0) {
      return res.status(200).json(targetAttendanceRecord);
    }
    else {
      return res.status(200).json({ message: "not found" });
    }

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance records', error: error.message });
  }
};

/**
 * Get admin attendance view for specific employee
 */
exports.getAdminAttendance = async (req, res) => {
  const { employeeId } = req.params;
  const { month, year } = req.query;

  console.log('Fetching attendance for employee:', employeeId, 'Month:', month, 'Year:', year); 

  try {
    const targetEmployee = await User.findById(employeeId);
    const targetEmployeeId = targetEmployee.employeeID

    const records = await AttendanceHistory.find({
      employeeId: targetEmployeeId,
      month: month ? parseInt(month, 10) : undefined,
      year: year ? parseInt(year, 10) : undefined
    });

    res.json({ attendanceRecords: records });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

/**
 * Auto-mark absent for employees who haven't marked attendance
 * Can be called manually or by cron job
 */
exports.autoMarkAbsent = async (req, res) => {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Get all employees
    const allEmployees = await User.find({}, 'employeeID _id');

    let absentsMarked = 0;
    let alreadyMarked = 0;

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
      } else {
        alreadyMarked++;
      }
    }

    res.status(200).json({
      message: 'Auto-absent marking completed',
      absentsMarked,
      alreadyMarked,
      totalEmployees: allEmployees.length,
      date: formattedDate
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to auto-mark absent',
      error: error.message
    });
  }
};

/**
 * Save attendance records (batch/admin endpoint)
 */
exports.saveAttendance = async (req, res) => {
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
    res.status(500).send({ error: "Failed to save attendance" });
  }
};
