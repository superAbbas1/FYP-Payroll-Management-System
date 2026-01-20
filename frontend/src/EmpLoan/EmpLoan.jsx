import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for API requests
import "./EmpLoan.css";

const EmpLoan = ({ employeeID }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [totalProvidentFund, setTotalProvidentFund] = useState(0);
  const [loanHistory, setLoanHistory] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);

  employeeID = localStorage.getItem('employeeId');

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loan-requests/${employeeID}`);
        setLoanRequests(response.data);
      } catch (error) {
        console.error('Error fetching loan requests:', error);
      }
    };

    fetchLoanRequests();
  }, [employeeID]);


  useEffect(() => {
    const fetchProvidentFundDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/provident-fund/${employeeID}`);
        setTotalProvidentFund(response.data.totalProvidentFund);
        setLoanHistory(response.data.loanHistory);
      } catch (error) {
        console.error("Error fetching provident fund details", error);
      }
    };

    fetchProvidentFundDetails();
  }, [employeeID]);

  const handleLoanRequest = async () => {
    if (parseInt(loanAmount) > totalProvidentFund) {
      alert("Your provident funds balance is not sufficient");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/loan-request`, {
        employeeID,
        loanAmount
      });
      setLoanAmount('');

      window.location.reload();
    } catch (error) {
      console.error("Error requesting loan", error);
    }
  };


  const handleDeleteRequest = async (requestId, employeeID) => {
    try {
      await axios.delete(`http://localhost:5000/api/to-delete-loan-request/${requestId}/${employeeID}`, {

        data: { employeeID }
      });
      setLoanRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error deleting loan request:', error);
    }
  };

  return (
    <div className="emp-loan-container">
      <h2>Request Loan</h2>
      <p>Total Provident Fund Balance: {totalProvidentFund} PKR</p>
      <div className="loan-request-section">
        <input
          type="number"
          placeholder="Enter loan amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <button className='main-button' onClick={handleLoanRequest}>Get</button>
      </div>

      <h3>Loan History</h3>
      <table className="loan-history-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date</th>
            <th className='hide-in-mobile-table'>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loanRequests.slice().reverse().map(request => (
            <tr key={request._id}>
              <td>{request.amount}</td>
              <td>{new Date(request.date).toLocaleDateString()}</td>
              <td className='hide-in-mobile-table '>{request.status}</td>
              <td>
                <button className='btn btn-primary' onClick={() => handleDeleteRequest(request._id, employeeID)}> Delete
                </button>
              </td>
              <td className='view-in-mobile-only-table pf-loan-status-icon'>
                  <span className='pf-loan-status'><strong>Status:</strong>{request.approved ? 'Approved' : 'Pending'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpLoan;