import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import "./EmployeePF.css";

const EmployeePF = () => {
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [providentFundData, setProvidentFundData] = useState([]);
  const [totalProvidentFundBalance, setTotalProvidentFundBalance] = useState(0);

  const employeeID = localStorage.getItem('employeeId');
  console.log("employeeID: ", employeeID);

  useEffect(() => {
    const fetchProvidentFundData = async () => {
      console.log("andar to a gyi hai");
      try {
        console.log("try k andr b a gyi");
        const year = selectedYear.getFullYear();
        console.log("yesr in api: ", year);
        const response = await axios.get(`http://localhost:5000/provident-fund/${employeeID}/${year}`);
        console.log("response: ", response);
        setProvidentFundData(response.data.providentFundHistory);
        setTotalProvidentFundBalance(response.data.totalProvidentFundBalance);
      } catch (error) {
        console.error('Error fetching provident fund data:', error);
      }
    };

    fetchProvidentFundData();
  }, [selectedYear]);

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
                <td>{Number(data.amount).toFixed(2)} PKR</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedYear && providentFundData.length === 0 && (
        <p>No provident fund data found for {selectedYear.getFullYear()}.</p>
      )}
    </div>
  );
};

export default EmployeePF;
