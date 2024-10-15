import React, { useState, useEffect } from 'react';
// import './AttendanceReport.css';
import "./EmployeeAttendance.css";
const EmployeeAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Months are zero-indexed
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [year, month]);

  const fetchAttendance = async () => {
    const employeeId = localStorage.getItem('employeeId');
    if (!employeeId) {
      alert("Employee ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${employeeId}?year=${year}&month=${month}`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.attendanceRecords);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
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
    {attendanceData.map((record) => (
      <tr key={record._id} className="attendance-table-row">
        <td className="attendance-table-cell">{new Date(record.date).toLocaleDateString()}</td>
        <td className="attendance-table-cell">{record.status}</td>
      </tr>
    ))}
  </tbody>
</table>

      
      
      
      </>
      // <table>
      //   <thead>
      //     <tr>
      //       <th>Date</th>
      //       <th>Status</th>
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {attendanceData.map((record) => (
      //       <tr key={record._id}>
      //         <td>{new Date(record.date).toLocaleDateString()}</td>
      //         <td>{record.status}</td>
      //       </tr>
      //     ))}
      //   </tbody>
      // </table>







    );
  };

  return (
    <div className="attendance-report-container">
      <h1>Attendance Report</h1>
      
      <div className="filters">
        <label htmlFor="year">Year:</label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={handleYearChange}
          min="2000"
          max={new Date().getFullYear()}
        />
        <label htmlFor="month">Month:</label>
        <input
          type="number"
          id="month"
          value={month}
          onChange={handleMonthChange}
          min="1"
          max="12"
        />
      </div>
      {renderAttendance()}
    </div>
  );
};

export default EmployeeAttendance;
