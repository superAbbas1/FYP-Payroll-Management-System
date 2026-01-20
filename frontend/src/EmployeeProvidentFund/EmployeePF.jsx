import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import "./EmployeePF.css";

const EmployeePF = () => {
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [providentFundData, setProvidentFundData] = useState([]);
  const [totalProvidentFundBalance, setTotalProvidentFundBalance] = useState(0);
  const [availableYears, setAvailableYears] = useState([]);

  const employeeID = localStorage.getItem('employeeId');

  useEffect(() => {
    const fetchProvidentFundData = async () => {
      try {
        const year = selectedYear.getFullYear();
        const response = await axios.get(`http://localhost:5000/provident-fund/${employeeID}/${year}`);
        setProvidentFundData(response.data.providentFundHistory);
        setTotalProvidentFundBalance(response.data.totalProvidentFundBalance);
        
        // Extract available years from all PF data
        if (response.data.providentFundHistory && response.data.providentFundHistory.length > 0) {
          const years = new Set();
          response.data.providentFundHistory.forEach(entry => {
            const yearFromEntry = entry.month.split(' ')[1];
            years.add(yearFromEntry);
          });
          setAvailableYears(Array.from(years).sort());
        }
      } catch (error) {
        console.error('Error fetching provident fund data:', error);
      }
    };

    fetchProvidentFundData();
  }, [selectedYear, employeeID]);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  const ReadOnlyInput = React.forwardRef((props, ref) => {
    return <input {...props} ref={ref} readOnly />;
  });

  return (
    <div className="provident-funds-container">
      <h1>Provident Funds - {selectedYear.getFullYear()}</h1>
      <div className="total-fund-balance">
        <h2>Total Provident Fund Balance: {Number(totalProvidentFundBalance).toFixed(2)} PKR</h2>
      </div>
      <div className="filter-container">
        <label htmlFor="year">Selected Year:</label>
        <DatePicker
          id='employee-pf-date-picker'
          selected={selectedYear}
          onChange={handleYearChange}
          dateFormat="yyyy"
          showYearPicker
          customInput={<ReadOnlyInput />}
        />
      </div>

      {selectedYear && providentFundData.length > 0 && (
        <>
          <div className="pf-info">
            <p>Showing all months in {selectedYear.getFullYear()} with provident fund allocations</p>
          </div>
          <table className="provident-funds-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {providentFundData.map((data, index) => (
                <tr key={index}>
                  <td>{data.month}</td>
                  <td>{Number(data.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {selectedYear && providentFundData.length === 0 && (
        <p className="no-data-message">No provident fund data found for {selectedYear.getFullYear()}.</p>
      )}
      
      {availableYears.length > 0 && (
        <div className="available-years">
          <p><strong>Available Years:</strong> {availableYears.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default EmployeePF;
