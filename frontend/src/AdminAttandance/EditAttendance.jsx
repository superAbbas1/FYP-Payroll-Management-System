import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditAttendance.css";

const EditAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees: ", error);
    }
  };

  const handleSelectEmployee = (e) => {
    const employeeId = e.target.value;
    const employee = employees.find(emp => emp._id === employeeId);
    setSelectedEmployee(employee);
    if (employee && selectedMonth) {
      const monthAttendance = employee.attendance.find(a => a.month === selectedMonth);
      setAttendance(monthAttendance ? monthAttendance.dates : {});
    }
  };

  const handleSelectMonth = (e) => {
    setSelectedMonth(e.target.value);
    if (selectedEmployee) {
      const monthAttendance = selectedEmployee.attendance.find(a => a.month === e.target.value);
      setAttendance(monthAttendance ? monthAttendance.dates : {});
    }
  };

  const handleAttendanceChange = (date, status) => {
    setAttendance(prevAttendance => ({
      ...prevAttendance,
      [date]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedEmployee || !selectedMonth) {
      alert("Please select an employee and a month");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/attendance/${selectedEmployee._id}`, {
        month: selectedMonth,
        dates: attendance,
      });
      alert("Attendance saved successfully");
    } catch (error) {
      console.error("Failed to save attendance: ", error);
    }
  };

  const generateDates = () => {
    const year = new Date().getFullYear();
    const month = selectedMonth ? parseInt(selectedMonth, 10) : new Date().getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(`${year}-${month < 10 ? '0' + month : month}-${i < 10 ? '0' + i : i}`);
    }

    return dates;
  };

  return (
    <div className="container">
      <h2 className="header">Edit Attendance</h2>
      <div className="month-selection">
        <label>Select Month:</label>
        <select onChange={handleSelectMonth}>
          <option value="">Select</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleDateString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      <div className="employee-selection">
        <label>Select Employee:</label>
        <select onChange={handleSelectEmployee}>
          <option value="">Select</option>
          {employees.map(employee => (
            <option key={employee._id} value={employee._id}>
              {employee.fname} {employee.lname}
            </option>
          ))}
        </select>
      </div>
      {selectedEmployee && selectedMonth && (
        <div className="attendance-table">
          <h3>Mark Attendance for {selectedEmployee.fname} {selectedEmployee.lname}</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {generateDates().map((date, index) => (
                <tr key={index}>
                  <td>{date}</td>
                  <td>
                    <select 
                      value={attendance[date] || ""}
                      onChange={(e) => handleAttendanceChange(date, e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveAttendance}>Save Attendance</button>
        </div>
      )}
    </div>
  );
};

export default EditAttendance;
