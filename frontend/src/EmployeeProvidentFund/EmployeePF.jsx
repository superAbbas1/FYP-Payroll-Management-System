import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./EmployeePF.css";

const EmployeePF = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [providentFundData, setProvidentFundData] = useState([]);
  const [totalProvidentFundBalance, setTotalProvidentFundBalance] = useState(0);
  const employeeID = localStorage.getItem('employeeId');

  console.log("employeeID: " , employeeID);

  useEffect(() => {
    const fetchProvidentFundData = async () => {
      console.log("andar to a gyi hai");
      try {
        console.log("try k andr b a gyi");
        const response = await axios.get(`http://localhost:5000/provident-fund/${employeeID}/${selectedYear}`);
        console.log("response: ", response);
        setProvidentFundData(response.data.providentFundHistory);
        setTotalProvidentFundBalance(response.data.totalProvidentFundBalance);
      } catch (error) {
        console.error('Error fetching provident fund data:', error);
      }
    };

    fetchProvidentFundData();
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="provident-funds-container">
      <h1>Provident Funds - {selectedYear}</h1>
      <div className="total-fund-balance">
        <h2>Total Provident Fund Balance: {totalProvidentFundBalance} PKR</h2>
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
    </div>
  );
};

export default EmployeePF;
