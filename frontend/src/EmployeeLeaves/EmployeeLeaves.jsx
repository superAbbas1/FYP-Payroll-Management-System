// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './EmployeeLeaves.css';

// const LeaveRequestForm = () => {
//   const [subject, setSubject] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const employeeId = localStorage.getItem('employeeId'); // Assuming employeeId is stored in localStorage

//   useEffect(() => {
//     const fetchLeaveRequests = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/leaves/${employeeId}`);
//         setLeaveRequests(response.data);
//       } catch (error) {
//         console.error('Error fetching leave requests:', error);
//       }
//     };
  
//     fetchLeaveRequests();
//   }, [employeeId]);
  

//   const handleSubmit = (e) => {
//     e.preventDefault();
  
//     // Convert dates to Date objects for comparison
//     const start = new Date(startDate);
//     const end = new Date(endDate);
  
//     // Validate date order
//     if (start > end) {
//       alert('Starting date must be before the ending date');
//       return;
//     }
  
//     const newLeaveRequest = {
//       employeeId,
//       subject,
//       startDate,
//       endDate,
//       status: 'Pending', // Default status
//     };
  
//     axios.post('http://localhost:5000/api/leaves', newLeaveRequest)
//       .then(response => {
//         setLeaveRequests([...leaveRequests, response.data]);
//         setSubject('');
//         setStartDate('');
//         setEndDate('');
//       })
//       .catch(error => console.error('Error submitting leave request:', error));
//   };
  

//   return (
//     <div className="form-container">
//       <h2>Leave Request Form</h2>

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <div className='reason'>
//             <label>Reason:</label>
//             <input
//               type="text"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               required
//             />
//           </div>

//           <div className='dates'>
//             <div className='starting-date'>
//               <label>Starting Date:</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 required
//               />
//             </div>

//             <div className='ending-date'>
//               <label>Ending Date:</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         <button className='leave-submit-button' type="submit">Submit</button>
//       </form>

//       <h3>Your Leave Requests</h3>
//       <ul className="leave-requests-list">
//         {leaveRequests.map((request) => (
//           <li key={request._id} className="leave-request-item">
//             <p><strong>Reason:</strong> {request.subject}</p>
//             <p><strong>Start Date:</strong> {request.startDate}</p>
//             <p><strong>End Date:</strong> {request.endDate}</p>
//             <p><strong>Status:</strong> {request.status}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default LeaveRequestForm;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeLeaves.css';

const EmployeeLeaves = () => {
  const [subject, setSubject] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const employeeId = localStorage.getItem('employeeId'); // Assuming employeeId is stored in localStorage

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leaves/${employeeId}`);
        setLeaveRequests(response.data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    fetchLeaveRequests();
  }, [employeeId]);

  const handleSubmit = (e) => {

    if (!subject || !startDate || !endDate){
      alert("All inputs must be fulfilled");
    }

    e.preventDefault();

    const newLeaveRequest = {
      employeeId,
      subject,
      startDate,
      endDate,
      status: 'Pending', // Default status
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
    <div className="form-container">
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

          <div className='dates'>
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
        <button className='leave-submit-button' type="submit">Submit</button>
      </form>

      <h3>Your Leave Requests</h3>
      <ul className="leave-requests-list">
        {leaveRequests.map((request) => (
          <li key={request._id} className="leave-request-item">
            <p><strong>Reason:</strong> {request.subject}</p>
            <p><strong>Start Date:</strong> {request.startDate}</p>
            <p><strong>End Date:</strong> {request.endDate}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <button
              className='leave-delete-button'
              onClick={() => handleDelete(request._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeLeaves;






// import React, { useState } from 'react';
// import './EmployeeLeaves.css';

// const LeaveRequestForm = () => {
//   const [subject, setSubject] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here, e.g., API call to send data to backend
//     console.log('Submitting leave request:', { subject, startDate, endDate });
//     // Clear form fields or show success message
//   };

//   return (
//     <div className="form-container">
//       <h2>Leave Request Form</h2>

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <div className='reason'>
//             <label>Reason:</label>
//             <input
//               type="text"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               required
//             />
//           </div>

//           <div  className='dates'>
//             <div className='starting-date'>
//               <label>Starting Date:</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 required
//               />
//             </div>

//             <div className='ending-date'>
//               <label>Ending Date:</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         <button className='leave-submit-button' type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default LeaveRequestForm;
