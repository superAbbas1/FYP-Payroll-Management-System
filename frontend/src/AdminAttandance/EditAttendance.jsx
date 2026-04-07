import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAttendanceScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    // Fetch the list of employees
    axios.get('/employeeslist')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const fetchAttendanceRecords = () => {
    if (selectedEmployee) {
      axios.get(`/api/admin/attendance/${selectedEmployee}`, {
        params: { year, month }
      })
      .then(response => setAttendanceRecords(response.data.attendanceRecords))
      .catch(error => console.error('Error fetching attendance records:', error));
    }
  };

  return (
    <div>
      <h1>Admin Attendance Screen</h1>

      <div>
        <label>Employee:</label>
        <select
          value={selectedEmployee}
          onChange={e => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map(employee => (
            <option key={employee._id} value={employee.employeeID}>
              {employee.fname} {employee.lname} ({employee.department} - {employee.designation})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          placeholder="e.g., 2024"
        />
      </div>

      <div>
        <label>Month:</label>
        <input
          type="number"
          value={month}
          onChange={e => setMonth(e.target.value)}
          placeholder="e.g., 8"
        />
      </div>

      <button onClick={fetchAttendanceRecords}>Fetch Attendance</button>

      <div>
        <h2>Attendance Records</h2>
        {attendanceRecords.length > 0 ? (
          <ul>
            {attendanceRecords.map(record => (
              <li key={record._id}>
                {record.date}: {record.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No records found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAttendanceScreen;
