import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Loan.css'; // Import your CSS file

const Loan = () => {
  const [loanRequests, setLoanRequests] = useState([]);

  useEffect(() => {
    // Fetch loan requests from the backend
    axios.get('http://localhost:5000/api/loans')
      .then(response => {
        setLoanRequests(response.data);
      })
      .catch(error => console.error('Error fetching loan requests:', error));
  }, []);

  const handleApprove = (id) => {
    axios.put(`http://localhost:5000/api/loans/${id}`, { approved: true })
      .then(() => {
        setLoanRequests(loanRequests.map(loan =>
          loan._id === id ? { ...loan, approved: true } : loan
        ));
      })
      .catch(error => console.error('Error approving loan request:', error));
  };

  const handleDecline = (id) => {
    axios.put(`http://localhost:5000/api/loans/${id}`, { approved: false })
      .then(() => {
        setLoanRequests(loanRequests.map(loan =>
          loan._id === id ? { ...loan, approved: false } : loan
        ));
      })
      .catch(error => console.error('Error declining loan request:', error));
  };

  const handleDelete = (id) => {
    // Remove the loan request from the frontend only
    setLoanRequests(loanRequests.filter(loan => loan._id !== id));
  };

  return (
    <div className="loan-screen-container">
      <h2>Loan from Provident Funds</h2>
      {loanRequests.map((loan, index) => (
        <div key={index} className="loan-card">
          <p>Employee Name: {loan.employeeName}</p>
          <p>Employee ID: {loan.employeeID}</p>
          <p>Loan Amount: {loan.amount} PKR</p>
          <p>Loan Date: {new Date(loan.date).toLocaleDateString()}</p>
          <div className="loan-actions">
            <button className="approve-button" onClick={() => handleApprove(loan._id)} disabled={loan.approved}>
              Approve
            </button>
            <button className="decline-button" onClick={() => handleDecline(loan._id)} disabled={!loan.approved}>
              Decline
            </button>
            <button className="delete-button" onClick={() => handleDelete(loan._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loan;
