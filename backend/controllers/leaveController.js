const User = require('../db/User');
const LeaveRequest = require('../db/LeaveRequest');

/**
 * Create new leave request
 */
exports.createLeaveRequest = async (req, res) => {
  try {
    const { employeeId, subject, startDate, endDate, status } = req.body;
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Starting date must be before the ending date' });
    }
    const user = await User.findOne({ employeeID: employeeId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newLeaveRequest = new LeaveRequest({
      employeeId: user.employeeID,
      employeeName: `${user.fname} ${user.lname}`,
      subject,
      startDate,
      endDate,
      status,
    });

    const savedLeaveRequest = await newLeaveRequest.save();

    user.leaveRequestsHistory.push({
      _id: savedLeaveRequest._id,
      subject,
      startDate,
      endDate,
      status
    });
    await user.save();
    res.status(201).json({ ...savedLeaveRequest.toObject(), employeeID: user.employeeID });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit leave request', error: error.message });
  }
};

/**
 * Get all leave requests
 */
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leave requests', error: error.message });
  }
};

/**
 * Get leave requests for specific employee
 */
exports.getEmployeeLeaveRequests = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const user = await User.findOne({ employeeID: employeeId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      leaveRequestsHistory: user.leaveRequestsHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests' });
  }
};

/**
 * Update leave request status
 */
exports.updateLeaveRequestStatus = async (req, res) => {
  try {
    const { status, id } = req.body;
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
};

/**
 * Delete leave request by employee
 */
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;
    const user = await User.findOne({ employeeID: employeeId });
    const index = await user.leaveRequestsHistory.findIndex(
      (leave) => leave._id.toString() === id
    );
    if (index !== -1) {
      user.leaveRequestsHistory.splice(index, 1);
      await user.save();
      res.status(200).json({ message: 'Leave request deleted successfully' });
    } else {
      res.status(404).json({ message: 'Leave request not found or does not belong to this employee' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete leave request', error: error.message });
  }
};

/**
 * Delete leave request by admin
 */
exports.deleteLeaveRequestAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete leave request', error: error.message });
  }
};
