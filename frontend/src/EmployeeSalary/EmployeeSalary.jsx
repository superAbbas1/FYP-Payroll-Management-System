import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeSalary.css';

const EmployeeSalary = () => {
  const [grossSalary, setGrossSalary] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to calculate income tax, provident fund, and net salary
  const calculateTaxAndFund = (gross) => {
    const incomeTax = gross * 0.025;
    const providentFund = gross * 0.1;
    const netSalary = gross - incomeTax - providentFund;
    return { incomeTax, providentFund, netSalary };
  };

  const employeeID = localStorage.getItem('employeeId');

  // Fetch salary from the API using employeeID from localStorage
  useEffect(() => {
    const fetchSalary = async () => {
      try {
        // Get the employeeID from localStorage
        
        console.log("emoloyee id frontend wali: ", employeeID);
        
        if (!employeeID) {
          console.error('No employee ID found in localStorage.');
          return;
        }

        // Fetch the salary from the backend API
        const response = await axios.get(`http://localhost:5000/api/user/salary/${employeeID}`);
        const salary = response.data.salary;
        
        setGrossSalary(salary);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching salary:', error);
        setLoading(false);
      }
    };

    fetchSalary();
  }, []);

  // If loading, show a loader
  if (loading) {
    return <div>Loading salary details...</div>;
  }

  // Calculate the values based on grossSalary
  const { incomeTax, providentFund, netSalary } = calculateTaxAndFund(grossSalary);

  return (
    <div className="salary-container">
      <h1>Salary Information</h1>
      <div className="salary-details">
        <p><strong>Gross Salary:</strong> <span>{grossSalary} PKR</span></p>
        <p><strong>Income Tax (2.5%):</strong> <span>{incomeTax.toFixed(2)} PKR</span></p>
        <p><strong>Provident Fund (10%):</strong> <span>{providentFund.toFixed(2)} PKR</span></p>
        <p><strong>Net Salary:</strong> <span>{netSalary.toFixed(2)} PKR</span></p>
      </div>
    </div>
  );
};

export default EmployeeSalary;
