import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAttendance.css';

const ViewAttendance = () => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDepartmentID, setSelectedDepartmentID] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [noRecordsMessage, setNoRecordsMessage] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDesignations = async () => {
      if (!selectedDepartmentID) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/departments/${selectedDepartmentID}/designations`
        );
        setDesignations(response.data);
      } catch (error) {
        console.error('Failed to fetch designations:', error);
      }
    };

    fetchDesignations();
  }, [selectedDepartmentID]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedDepartment || !selectedDesignation) return;

      try {
        const response = await axios.get('http://localhost:5000/employeeslist', {
          params: {
            department: selectedDepartment,
            designation: selectedDesignation,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };

    fetchEmployees();
  }, [selectedDepartment, selectedDesignation]);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      console.log('Fetching attendance records...');
      if (!selectedEmployee || !selectedYear || !selectedMonth) return;
      console.log(`Selected Employee: ${selectedEmployee}, Year: ${selectedYear}, Month: ${selectedMonth}`);

      try {
        console.log('Making API request to fetch attendance records...');
        const response = await axios.get(
          `http://localhost:5000/api/adminattendance/${selectedEmployee}`,
          {
            params: {
              month: selectedMonth,
              year: selectedYear,
            },
          }
        );

        if (response.data.attendanceRecords && response.data.attendanceRecords.length > 0) {
          setAttendanceRecords(response.data.attendanceRecords);
          setNoRecordsMessage('');
        } else {
          setAttendanceRecords([]);
          setNoRecordsMessage('No attendance records found for the selected criteria.');
        }
      } catch (error) {
        console.error('Failed to fetch attendance records:', error);
        setAttendanceRecords([]);
        setNoRecordsMessage('Failed to fetch attendance records.');
      }
    };

    fetchAttendanceRecords();
  }, [selectedEmployee, selectedYear, selectedMonth]);

  const handleDepartmentChange = (event) => {
    const selectedDeptId = event.target.value;
    const selectedDept = departments.find((dept) => dept._id === selectedDeptId);

    setSelectedDepartmentID(selectedDeptId);
    setSelectedDepartment(selectedDept?.name || '');
    setSelectedDesignation('');
    setSelectedEmployee('');
    setDesignations([]);
    setEmployees([]);
    setAttendanceRecords([]);
    setNoRecordsMessage('');
  };

  const handleDesignationChange = (event) => {
    setSelectedDesignation(event.target.value);
    setSelectedEmployee('');
    setEmployees([]);
    setAttendanceRecords([]);
    setNoRecordsMessage('');
  };

  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
    setAttendanceRecords([]);
    setNoRecordsMessage('');
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setAttendanceRecords([]);
    setNoRecordsMessage('');
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setAttendanceRecords([]);
    setNoRecordsMessage('');
  };

  return (
    <div className="view-attendance-container">
      <h2 className="view-attendance-title">View Attendance</h2>
      <div className="view-attendance-filters grid-3-col">
        <div className="filter-item">
          <label>Department:</label>
          <select value={selectedDepartmentID} onChange={handleDepartmentChange}>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Designation:</label>
          <select
            value={selectedDesignation}
            onChange={handleDesignationChange}
            disabled={!selectedDepartmentID}
          >
            <option value="">Select Designation</option>
            {designations.map((desig, index) => (
              <option key={index} value={desig}>
                {desig}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Employee Name:</label>
          <select
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            disabled={!selectedDesignation}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.fname} {emp.lname} - cnic:({emp.cnic})
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Year:</label>
          <select value={selectedYear} onChange={handleYearChange} disabled={!selectedEmployee}>
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Month:</label>
          <select value={selectedMonth} onChange={handleMonthChange} disabled={!selectedYear}>
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

      </div>
  
      {attendanceRecords.length > 0 ? (
        <div className="attendance-records">
          <h3 className="attendance-records-title">Attendance Records</h3>
          <table className="attendance-records-table">
            <thead className='attendance-table-header'>
              <tr className='attendance-table-row'>
                <th className='attendance-table-header-cell'>Date</th>
                <th className='attendance-table-header-cell'>Status</th>
              </tr>
            </thead>
            <tbody className='attendance-table-body'>
              {attendanceRecords.map((record, idx) => (
                <tr key={record.date + '-' + idx} className="attendance-table-row">
                  <td className='attendance-table-cell'>{new Date(record.date).toLocaleDateString()}</td>
                  <td className='attendance-table-cell'>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        noRecordsMessage && <div className="no-records-message">{noRecordsMessage}</div>
      )}

    </div>
  );
};

export default ViewAttendance;