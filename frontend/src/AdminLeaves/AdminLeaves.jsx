import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminLeaves.css';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch all leave requests
    axios.get('http://localhost:5000/api/leaves')
      .then(response => setRequests(response.data))
      .catch(error => console.error('Error fetching leave requests:', error));
  }, []);

  const handleAccept = (id) => {
    axios.put(`http://localhost:5000/api/leaves/${id}`, { status: 'Accepted' })
      .then(() => {
        setRequests(requests.map(request =>
          request._id === id ? { ...request, status: 'Accepted' } : request
        ));
      })
      .catch(error => console.error('Error accepting leave request:', error));
  };

  const handleReject = (id) => {
    axios.put(`http://localhost:5000/api/leaves/${id}`, { status: 'Rejected' })
      .then(() => {
        setRequests(requests.map(request =>
          request._id === id ? { ...request, status: 'Rejected' } : request
        ));
      })
      .catch(error => console.error('Error rejecting leave request:', error));
  };

  return (
    <div className="requests-container">
      <h2>Leave Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request._id} className="request-item">
            <div className="request-details">
              <p><strong>Employee Name:</strong> Abbas Mansoor</p>
              <p><strong>Reason:</strong> {request.subject}</p>
              <p><strong>Start Date:</strong> {request.startDate}</p>
              <p><strong>End Date:</strong> {request.endDate}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </div>
            <div className="request-actions">
              <button
                onClick={() => handleAccept(request._id)}
                className="accept-btn"
                disabled={request.status !== 'Pending'}
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request._id)}
                className="reject-btn"
                disabled={request.status !== 'Pending'}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveRequests;
