import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminLeaves.css';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaves')
      .then(response => setRequests(response.data))
      .catch(error => console.error('Error fetching leave requests:', error));
  }, []);
  console.log('respnse: ', requests);

  const handleStatusChange = (id, status) => {
    console.log("request id: ", id);
    axios.put(`http://localhost:5000/api/leaves/${id}`, { status, id })
      .then(() => {
        setRequests(requests.map(request =>
          request._id === id ? { ...request, status } : request
        ));
      })
      .catch(error => console.error(`Error updating leave request to ${status}:`, error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/admin-leaves/${id}`)
      .then(() => {
        setRequests(requests.filter(request => request._id !== id));
      })
      .catch(error => console.error('Error deleting leave request:', error));
  };

  return (
    <div className="admin-leave-section requests-container">
      <h2>Leave Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request._id} className="request-item">
            <div className="request-details">
              <p><strong>Employee Id:</strong> {request.employeeId}</p>
              <p><strong>Employee Name:</strong> {request.employeeName}</p>
              <p><strong>Reason:</strong> {request.subject}</p>
              <p><strong>Start Date:</strong> {request.startDate ? request.startDate.slice(0, 10) : ''}</p>
              <p><strong>End Date:</strong> {request.endDate ? request.endDate.slice(0, 10) : ''}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </div>
            <div className="request-actions">
              <button
                onClick={() => handleStatusChange(request._id, 'Accepted')}
                className="btn btn-primary"
                disabled={request.status !== 'Pending'}
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange(request._id, 'Rejected')}
                className="btn btn-secondary"
                disabled={request.status !== 'Pending'}
              >
                Reject
              </button>

              <button
                onClick={() => handleDelete(request._id)}
                className="btn btn-danger"
              >
                Close
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveRequests;