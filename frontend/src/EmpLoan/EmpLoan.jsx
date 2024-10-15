import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for API requests
import "./EmpLoan.css";

const EmpLoan = ({ employeeID }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [totalProvidentFund, setTotalProvidentFund] = useState(0);
  const [loanHistory, setLoanHistory] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);


// Ensure employeeID is being set correctly somewhere in your component


  employeeID = localStorage.getItem('employeeId');
  console.log("ssab se oopar wali employeeID: ", employeeID);


  useEffect(() => {
    const fetchLoanRequests = async () => {
        console.log("ye wali chal rhi hau");
      try {
        const response = await axios.get(`http://localhost:5000/api/loan-requests/${employeeID}`);
        setLoanRequests(response.data);
        console.log("response of laon requests:  ", response);
      } catch (error) {
        console.error('Error fetching loan requests:', error);
      }
    };
  
    fetchLoanRequests();
  }, [employeeID]);
  

  useEffect(() => {
    // Fetch total provident fund and loan history when the component mounts
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
  
      // Ensure the new loan request is added to the loanHistory state
      //setLoanRequests(prevHistory => [...prevHistory, response.data.newLoanRequest]);
      setLoanAmount(''); // Clear the input field


      window.location.reload();
    } catch (error) {
      console.error("Error requesting loan", error);
    }
  };
  

  const handleDeleteRequest = async (requestId, employeeID) => {
    console.log("reqId : ", requestId, "  empID; ", employeeID);
    try {
      await axios.delete(`http://localhost:5000/api/to-delete-loan-request/${requestId}/${employeeID}`, {
        
        data: { employeeID } // Axios requires `data` for the request body in DELETE requests
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
        <button onClick={handleLoanRequest}>Get</button>
      </div>

      <h3>Loan History</h3>
      <table className="loan-history-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
           {loanRequests.map(request => (
            <tr key={request._id}>
              <td>{request.amount}</td>
              <td>{new Date(request.date).toLocaleDateString()}</td>
              <td>{request.approved ? 'Approved' : 'Pending'}</td>
              <td>
                <button onClick={() => handleDeleteRequest(request._id,employeeID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpLoan;
