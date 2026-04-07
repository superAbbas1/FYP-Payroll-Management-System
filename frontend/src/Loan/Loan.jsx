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
    <div className="admin-side-loan loan-screen-container">
      <h2>Loan Requests from Provident Funds</h2>
      {loanRequests.map((loan, index) => (
        <div key={index} className="loan-card">
          <p><strong>Employee Name:</strong> {loan.employeeName}</p>
          <p><strong>Employee ID:</strong> {loan.employeeID}</p>
          <p><strong>Loan Amount:</strong> {loan.amount} PKR</p>
          <p><strong>Loan Date:</strong> {new Date(loan.date).toLocaleDateString()}</p>
          <div className="loan-actions">
            <button className="main-button" onClick={() => handleApprove(loan._id)} disabled={loan.approved}>
              Approve
            </button>
            <button className="main-button-2" onClick={() => handleDecline(loan._id)} disabled={!loan.approved}>
              Decline
            </button>
            <button className="delete-button close-button" onClick={() => handleDelete(loan._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loan;
