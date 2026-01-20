import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./EmployeeAttendance.css";

const EmployeeAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);

  const fetchAttendance = async (date) => {
    setSelectedDate(date);
    const employeeId = localStorage.getItem('employeeId');
    if (!employeeId) {
      alert("Employee ID not found. Please log in again.");
      return;
    }
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth() + 1;
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${employeeId}?targetYear=${targetYear}&targetMonth=${targetMonth}`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
        renderAttendance();
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const renderAttendance = () => {
    if (error) return <p className="error-message">{error}</p>;
    if (!attendanceData.length) return <p>No attendance records found.</p>;

    return (
      <>
        <table className="attendance-table">
          <thead className="attendance-table-header">
            <tr className="attendance-table-row">
              <th className="attendance-table-header-cell">Date</th>
              <th className="attendance-table-header-cell">Status</th>
            </tr>
          </thead>
          <tbody className="attendance-table-body">
            {attendanceData.slice().reverse().map((record) => (
              <tr key={record._id} className="attendance-table-row">
                <td className="attendance-table-cell">{new Date(record.date).toLocaleDateString()}</td>
                <td className="attendance-table-cell">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const ReadOnlyInput = React.forwardRef((props, ref) => (
    <input {...props} ref={ref} readOnly />
  ));

  return (
    <div className="attendance-report-container">
      <h1>Attendance Report</h1>

      <div className="filters">
        <label htmlFor="date-picker">Select Month:</label>
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={fetchAttendance}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          showFullMonthYearPicker
          maxDate={new Date()}
          customInput={<ReadOnlyInput />}
          placeholderText='Select'
        />
      </div>
      {renderAttendance()}
    </div>
  );
};

export default EmployeeAttendance;