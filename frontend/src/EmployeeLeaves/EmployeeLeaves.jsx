import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeLeaves.css';
import { jsx } from 'react/jsx-runtime';

const EmployeeLeaves = () => {
  const [subject, setSubject] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leaves/${employeeId}`);
        const leaveRequests = response.data.leaveRequestsHistory;
        setLeaveRequests(leaveRequests);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    fetchLeaveRequests();
  }, [employeeId]);


  const handleSubmit = (e) => {
    if (!subject || !startDate || !endDate) {
      alert("All inputs must be fulfilled");
    }

    e.preventDefault();

    const newLeaveRequest = {
      employeeId,
      subject,
      startDate,
      endDate,
      status: 'Pending',
    };

    axios.post('http://localhost:5000/api/leaves', newLeaveRequest)
      .then(response => {
        setLeaveRequests([...leaveRequests, response.data]);
        setSubject('');
        setStartDate('');
        setEndDate('');
      })
      .catch(error => console.error('Error submitting leave request:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/leaves/${id}`, { data: { employeeId } })
      .then(() => {
        setLeaveRequests(leaveRequests.filter(request => request._id !== id));
      })
      .catch(error => console.error('Error deleting leave request:', error));
  };

  return (
    <div className="employee-leave-form-container">
      <h2>Leave Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className='reason'>
            <label>Reason:</label>
            <textarea
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className='dates grid-2-col'>
            <div className='starting-date'>
              <label>Starting Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className='ending-date'>
              <label>Ending Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div>
          <button className='btn btn-primary' type="submit">Submit</button>
        </div>
      </form>
      <h3>Your Leave Requests</h3>

      <ul className="leave-requests-list">
        {(Array.isArray(leaveRequests) ? leaveRequests : []).map((request) => (
          <li key={request._id} className="leave-request-item">
            <span className="leave-status-badge">{request.status}</span>
            <div className="leave-reason-row">{request.subject}</div>
            <div className='lower-row-wrapper'>
              <div className="leave-dates-row">
                <span className="leave-date-value">{request.startDate ? request.startDate.slice(0, 10) : ''}</span>
                <span className="leave-date-label">/</span>
                <span className="leave-date-value">{request.endDate ? request.endDate.slice(0, 10) : ''}</span>
              </div>
              <button
                className='btn btn-danger'
                onClick={() => handleDelete(request._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeLeaves;
