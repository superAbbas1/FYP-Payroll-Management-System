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

  const handleStatusChange = (amount, id, status) => {
    console.log('id going to update: ', id);
    axios.put(`http://localhost:5000/api/loans/${id}`, { status , amount, id })
      .then(() => {
        setLoanRequests(loanRequests.map(loan =>
          loan._id === id ? { ...loan, status } : loan
        ));
      })
      .catch(error => console.error(`Error updating Loan Request to ${status}: `, error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/admin/loan-request-delete/${id}`)
      .then(() => {
        setLoanRequests(loanRequests.filter(loan => loan._id !== id));
      })
      .catch(error => console.error("Error deleting loan request: ", error));
  };

  return (
    <>

      <div className="admin-side-loan loan-screen-container">
        <h2>Loan Requests from Provident Funds</h2>
        <div className='loan-request-wrapper'>
        {loanRequests.map((loan, index) => (
          <div key={index} className="loan-card">
            <p><strong>Employee Name:</strong> {loan.employeeName}</p>
            <p><strong>Employee ID:</strong> {loan.employeeId}</p>
            <p><strong>Loan Amount:</strong> {loan.loanAmount} PKR</p>
            <p><strong>Loan Date:</strong> {new Date(loan.loanDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {loan.status}</p>
            <div className="loan-actions">
              <button className="main-button" onClick={() => handleStatusChange(loan.loanAmount ,loan._id, 'Approved')} disabled={loan.status !== 'pending'}>
                Approve
              </button>
              <button className="main-button-2" onClick={() => handleStatusChange(loan.amount ,loan._id, 'Declined')} disabled={loan.status !== 'pending'}>
                Decline
              </button>
              <button className="delete-button close-button" onClick={() => handleDelete(loan._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
};

export default Loan;
