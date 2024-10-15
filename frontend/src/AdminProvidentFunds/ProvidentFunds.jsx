import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProvidentFunds = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDepartmentID, setSelectedDepartmentID] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [providentFundData, setProvidentFundData] = useState([]);
  const [totalProvidentFundBalance, setTotalProvidentFundBalance] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        setError('Failed to fetch departments');
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
        setError('Failed to fetch designations');
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
        setError('Failed to fetch employees');
      }
    };

    fetchEmployees();
  }, [selectedDepartment, selectedDesignation]);

  useEffect(() => {
    const fetchProvidentFundData = async () => {
      if (!selectedEmployee || !selectedYear) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/provident-fund/${selectedEmployee}/${selectedYear}`
        );
        // Check if response.data contains providentFundHistory and totalProvidentFundBalance
        if (response.data.providentFundHistory && response.data.totalProvidentFundBalance !== undefined) {
          setProvidentFundData(response.data.providentFundHistory);
          setTotalProvidentFundBalance(response.data.totalProvidentFundBalance);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Unexpected response format');
        }
      } catch (error) {
        console.error('Failed to fetch provident fund details:', error);
        setError('Failed to fetch provident fund details');
      }
    };

    fetchProvidentFundData();
  }, [selectedEmployee, selectedYear]);

  const handleDepartmentChange = (event) => {
    const selectedDeptId = event.target.value;
    const selectedDept = departments.find(dept => dept._id === selectedDeptId);
    setSelectedDepartmentID(selectedDeptId);
    setSelectedDepartment(selectedDept ? selectedDept.name : '');
    setSelectedDesignation('');
    setSelectedEmployee('');
    setDesignations([]);
    setEmployees([]);
    setProvidentFundData([]);
    setTotalProvidentFundBalance(0);
  };

  const handleDesignationChange = (event) => {
    setSelectedDesignation(event.target.value);
    setSelectedEmployee('');
    setEmployees([]);
    setProvidentFundData([]);
    setTotalProvidentFundBalance(0);
  };

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    setSelectedEmployee(employeeId);

    const selectedEmp = employees.find(emp => emp._id === employeeId);
    if (selectedEmp) {
      setEmployeeName(`${selectedEmp.fname} ${selectedEmp.lname}`);
    } else {
      setEmployeeName('');
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="provident-funds-container">
      <h2>Provident Funds</h2>
      <div className="filter-line">
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

        <div className="filter-container">
          <label htmlFor="year">Select Year:</label>
          <select id="year" value={selectedYear} onChange={handleYearChange}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            {/* Add more years as needed */}
          </select>
        </div>
      </div>

      {/* Provident Fund Details Section */}
      {providentFundData.length > 0 ? (
        <>
          <div className="total-fund-balance">
            <h2>Total Provident Fund Balance: {totalProvidentFundBalance} PKR</h2>
          </div>
          <table className="provident-funds-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {providentFundData.map((data, index) => (
                <tr key={index}>
                  <td>{data.month}</td>
                  <td>{data.amount} PKR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No provident fund details available for the selected employee and year.</p>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ProvidentFunds;
