import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './ProvidentFunds.css';

const ProvidentFunds = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [providentFundData, setProvidentFundData] = useState([]);
  const [totalProvidentFundBalance, setTotalProvidentFundBalance] = useState(0);
  const [error, setError] = useState(null);

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/employeeslist');
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        setError('Failed to fetch employees');
      }
    };

    fetchEmployees();
  }, []);

  // Fetch provident fund details when employee or year changes
  useEffect(() => {
    const fetchProvidentFundData = async () => {
      if (!selectedEmployee || !selectedYear) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/provident-fund/${selectedEmployee}/${selectedYear}`
        );
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

  const ReadOnlyInput = React.forwardRef((props, ref) => (
    <input {...props} ref={ref} readOnly />
  ));

  return (
    <div className="admin-provident-funds-container">
      <h2>Provident Funds</h2>
      <div className="filter-line grid-2-col">
        <div className="filter-item">
          <label>Employee Name:</label>
          <select
            value={selectedEmployee}
            onChange={handleEmployeeChange}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.fname} {emp.lname} - id:({emp.employeeID})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="year">Year:</label>
          <DatePicker
            selected={selectedYear ? new Date(selectedYear, 0) : null}
            onChange={date => setSelectedYear(date.getFullYear().toString())}
            showYearPicker
            dateFormat="yyyy"
            placeholderText="Select Year"
            disabled={!selectedEmployee}
            customInput={<ReadOnlyInput />}
          />
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