import React, { useState } from 'react';
import './MarkAttendance.css';

const MarkAttendance = () => {
  const [showAttendanceContainer, setShowAttendanceContainer] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);
  const currentDate = new Date().toISOString(); // Use ISO format for consistency

  const handleMarkAttendanceClick = () => {
    setShowAttendanceContainer(true);
    setAttendanceMarked(false);
  };

  const markAttendance = async (status) => {
    const employeeId = localStorage.getItem('employeeId'); // Retrieve employee ID from localStorage

    if (!employeeId) {
      alert("Employee ID not found. Please log in again.");
      return;
    }

    const attendanceData = {
      employeeId,
      date: currentDate,
      status
    };

    try {
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        setAttendanceMarked(true);
        setTimeout(() => {
          setShowAttendanceContainer(false);
        }, 1000); // Adjust the timeout to match your fade-out animation duration
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        alert("Failed to mark attendance. Attendance for that date is already registered.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {/* Button to show attendance container */}
      <button onClick={handleMarkAttendanceClick} className="attendance-button">Mark Attendance</button>

      {showAttendanceContainer && (
        <div className={`attendance-container ${attendanceMarked ? 'fade-out' : ''}`}>
          <div className="attendance-menu">
            <p>{currentDate}</p>
            <button className="attendance-option" onClick={() => markAttendance("Present")}>Present</button>
            <button className="attendance-option" onClick={() => markAttendance("Absent")}>Absent</button>
            <button className="attendance-option" onClick={() => markAttendance("Leave")}>Leave</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
