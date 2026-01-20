import React, { useState, useEffect } from 'react';
import "./MarkAttendance.css";

const MarkAttendance = () => {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [todayStatus, setTodayStatus] = useState(null);

  useEffect(() => {
    // Check if attendance has already been marked for today
    checkTodayAttendance();
  }, []);

  const checkTodayAttendance = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      if (!employeeId) {
        setMessage('Employee ID not found. Please log in again.');
        setMessageType('error');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `http://localhost:5000/api/employee-attendance-today?employeeId=${employeeId}&date=${today}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.attendanceMarked) {
          setAttendanceMarked(true);
          setTodayStatus(data.status);
          setMessage(`Attendance already marked as ${data.status} for today`);
          setMessageType('info');
        }
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const markAttendancePresent = async () => {
    try {
      setLoading(true);
      const employeeId = localStorage.getItem('employeeId');
      if (!employeeId) {
        setMessage('Employee ID not found. Please log in again.');
        setMessageType('error');
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employeeId,
          date: today,
          status: 'Present'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAttendanceMarked(true);
        setTodayStatus('Present');
        setMessage('✓ Attendance marked as Present for today!');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to mark attendance');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('An error occurred while marking attendance');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mark-attendance-container">
      <h1>Mark Your Attendance</h1>
      
      <div className="attendance-status-card">
        {message && (
          <div className={`message message-${messageType}`}>
            {message}
          </div>
        )}

        <div className="attendance-info">
          <p className="attendance-date">Date: {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          
          {todayStatus && (
            <p className={`attendance-status status-${todayStatus.toLowerCase()}`}>
              Status: {todayStatus}
            </p>
          )}
        </div>

        <button
          className="btn-mark-present"
          onClick={markAttendancePresent}
          disabled={attendanceMarked || loading}
        >
          {loading ? 'Marking...' : attendanceMarked ? '✓ Marked' : 'Mark Present'}
        </button>

        <div className="attendance-instructions">
          <p><strong>Instructions:</strong></p>
          <ul>
            <li>Click the "Mark Present" button to mark your attendance for today</li>
            <li>You can only mark attendance once per day</li>
            <li>If you don't mark attendance by end of day, you'll be marked as Absent</li>
            <li>Check your attendance history in the Attendance Report section</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
