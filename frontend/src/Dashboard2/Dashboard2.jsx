// import React from 'react';
// import './Dashboard2.css'; // Import the CSS file
// import Header from '../Header/Header';
// import EmpSidebar from '../EmployeeSidebar/EmpSidebar';
// import { Outlet, useLocation } from 'react-router-dom';

// const Dashboard2 = () => {
//   const location = useLocation();

//   // Check if the current route matches the base dashboard route
//   const isBaseRoute = location.pathname === '/dashboard2';

//   return (
//     <>
//       <Header />
//       <div className='emp-dashboard-container'>
//         <div className='emp-sidebar'>
//           <EmpSidebar />
//         </div>
//         <div className='emp-content'>
//           {isBaseRoute && (
//             <div className="emp-heading">
//               <h2>Welcome to EMPLOYEEE Payroll Management System!</h2>
//               <p className="emp-guide-text">
//                 Thank you for logging in. Here, you can manage all your payroll-related tasks efficiently.
//                 Explore the sidebar to access various features such as contact information, employee list,
//                 registration, and more.
//               </p>
//             </div>
//           )}
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard2;








/////brand newwww with change passworddd//////////////


import React, { useState } from 'react';
import './Dashboard2.css';
import Header from '../Header/Header';
import EmpSidebar from '../EmployeeSidebar/EmpSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import Modal from 'react-modal'; // Import the Modal component
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';


const Dashboard2 = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === '/dashboard2';

  const [showAttendanceContainer, setShowAttendanceContainer] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];

  const handleMarkAttendanceClick = () => {
    setShowAttendanceContainer(true);
    setAttendanceMarked(false);
  };

  const markAttendance = async (status) => {
    const employeeId = localStorage.getItem('employeeId');
    if (!employeeId) {
      alert("Employee ID not found. Please log in again.");
      return;
    }

    const attendanceData = { employeeId, date: currentDate, status };

    try {
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        setAttendance(status);
        setAttendanceMarked(true);
        setTimeout(() => {
          setShowAttendanceContainer(false);
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        alert("Failed to mark attendance. Attendance for that date is already registered.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("An error occurred. Please try again.");
    }
  };

  // Handle password change button click
  const handleOpenPasswordModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');

    //setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  // Handle form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`); // Debug log

    // Update the corresponding state based on the name
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    }


    console.log("1: ", currentPassword, "2: ", newPassword, "3: ", confirmNewPassword);
  };

  // Handle password update logic
  const handleUpdatePassword = async () => {
    const employeeId = localStorage.getItem('employeeId');
    console.log("employeeid: ", employeeId);

    if (!employeeId) {
      alert("Employee ID not found. Please log in again.");
      return;
    }

    // Fetch current employee data
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`);
      const employee = await response.json();
      console.log("employee k apassword: ", employee.password);

      // Decrypt the current password
      const decryptedPassword = AES.decrypt(employee.password, "bsjdsab12bsandb213").toString(Utf8);

      console.log("decrypted  password: ", decryptedPassword);
      // Validate current password
      if (decryptedPassword !== currentPassword) {
        alert("Your current password is incorrect. Please try again.");
        return;
      }

      // Check if new password matches confirmation
      if (newPassword !== confirmNewPassword) {
        alert("The new password and confirmation password do not match. Please try again.");
        return;
      }

      // Encrypt the new password
      const encryptedPassword = AES.encrypt(newPassword, "bsjdsab12bsandb213").toString();
      console.log("naya apassowrd: ", encryptedPassword);
      // Update password in the database
      console.log("hellooo bhai");
      const updateResponse = await fetch(`http://localhost:5000/api/employees/${employeeId}/updatePassword`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: encryptedPassword,
          currentPassword: currentPassword,
          newPassword: newPassword,
        })
      });

      if (updateResponse.ok) {
        alert("Password updated successfully.");
        handleCloseModal();
      } else {
        alert("An error occurred while updating the password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className='emp-dashboard-container'>
        <div className='emp-sidebar'>
          <EmpSidebar />
        </div>
        <div className='emp-content'>
          {isBaseRoute && (
            <>
              <div className="emp-heading">
                <h2>Welcome to the Employee Dashboard!</h2>
                <p className="emp-guide-text">
                  Thank you for logging in. Here, you can manage all your payroll-related tasks efficiently.
                  Explore the sidebar to access various features such as your contact information, requesting for Leaves 
                  and more.
                </p>
              </div>

              <div className='emp-dashboard-things'>
                <div className='whole-attendance-container'>
                  <button onClick={handleMarkAttendanceClick} className="attendance-button">Mark Attendance</button>
                  {showAttendanceContainer && (
                    <div className={`attendance-container ${attendanceMarked ? 'fade-out' : ''}`}>
                      <div className={`attendance-menu ${attendanceMarked ? '' : 'visible'}`}>
                        <p>Today's Date: {currentDate}</p>
                        <div className='attendanceOptions'>
                          <button className="attendance-option" onClick={() => markAttendance("Present")}>Present</button>
                          <button className="attendance-option" onClick={() => markAttendance("Absent")}>Absent</button>
                          <button className="attendance-option" onClick={() => markAttendance("Leave")}>Leave</button>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                      </div>
                    </div>
                  )}
                  {attendanceMarked && (
                    <p className="success-message visible">
                      Your attendance for today is marked as {attendance}.
                    </p>
                  )}
                </div>

                <div className='change-password-container'>
                  <div className='secure-heading'>
                    <h3>Secure your account</h3>
                  </div>
                  <div className='secure-paragraph'>
                    <p>Change your password to make your account secure!</p>
                  </div>
                  <div className='secure-button'>
                    <button onClick={handleOpenPasswordModal}>Change Password</button>
                  </div>
                </div>
              </div>
            </>
          )}
          <Outlet />
        </div>
      </div>

      {/* Password Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} contentLabel="Change Password" className="modal" overlayClassName="overlay">
        <div className="modal-content">
          <h2>Here you can update your password</h2>
          <div className="modal-row">
            <label>
              Current Password:
              <input type="password" name="currentPassword" value={currentPassword} onChange={handlePasswordChange} />
            </label>
            <label>
              New Password:
              <input type="password" name="newPassword" value={newPassword} onChange={handlePasswordChange} />
            </label>
            <label>
              Confirm New Password:
              <input type="password" name="confirmNewPassword" value={confirmNewPassword} onChange={handlePasswordChange} />
            </label>
          </div>
          <button className="modal-save" onClick={handleUpdatePassword}>Update Password</button>
          <button className="modal-close" onClick={handleCloseModal}>Close</button>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard2;







////new one/////




// import React, { useState } from 'react';
// import './Dashboard2.css';
// import Header from '../Header/Header';
// import EmpSidebar from '../EmployeeSidebar/EmpSidebar';
// import { Outlet, useLocation } from 'react-router-dom';

// const Dashboard2 = () => {
//   const location = useLocation();
//   const isBaseRoute = location.pathname === '/dashboard2';

//   const [showAttendanceContainer, setShowAttendanceContainer] = useState(true);
//   const [attendanceMarked, setAttendanceMarked] = useState(false);
//   const [attendance, setAttendance] = useState(null);
//   const [error, setError] = useState(null);
//   const currentDate = new Date().toISOString().split('T')[0];

//   const handleMarkAttendanceClick = () => {
//     setShowAttendanceContainer(true); // Show the attendance container
//     setAttendanceMarked(false); // Reset the marked state
//   };

//   const markAttendance = async (status) => {
//     const employeeId = localStorage.getItem('employeeId');
//     if (!employeeId) {
//       alert("Employee ID not found. Please log in again.");
//       return;
//     }

//     const attendanceData = {
//       employeeId,
//       date: currentDate,
//       status
//     };

//     try {
//       const response = await fetch('http://localhost:5000/api/attendance', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(attendanceData),
//       });

//       if (response.ok) {
//         setAttendance(status); // Store the marked attendance status
//         setAttendanceMarked(true); // Set the marked state to true
//         setTimeout(() => {
//           setShowAttendanceContainer(false); // Hide the attendance container after marking
//         }, 1000);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message);
//         alert("Failed to mark attendance. Attendance for that date is already registered.");
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className='emp-dashboard-container'>
//         <div className='emp-sidebar'>
//           <EmpSidebar />
//         </div>
//         <div className='emp-content'>
//           {isBaseRoute && (
//             <>
//               <div className="emp-heading">
//                 <h2>Welcome to EMPLOYEE Payroll Management System!</h2>
//                 <p className="emp-guide-text">
//                   Thank you for logging in. Here, you can manage all your payroll-related tasks efficiently.
//                   Explore the sidebar to access various features such as contact information, employee list,
//                   registration, and more.
//                 </p>
//               </div>

//               <div className='emp-dashboard-things'>
//                 <div className='whole-attendance-container'>
//                   <button onClick={handleMarkAttendanceClick} className="attendance-button">Mark Attendance</button>

//                   {showAttendanceContainer && (
//                     <div className={`attendance-container ${attendanceMarked ? 'fade-out' : ''}`}>
//                       <div className={`attendance-menu ${attendanceMarked ? '' : 'visible'}`}>
//                         <p>Today's Date: {currentDate}</p>
//                         <div className='attendanceOptions'>
//                           <button className="attendance-option" onClick={() => markAttendance("Present")}>Present</button>
//                           <button className="attendance-option" onClick={() => markAttendance("Absent")}>Absent</button>
//                           <button className="attendance-option" onClick={() => markAttendance("Leave")}>Leave</button>
//                         </div>
//                         {error && <p className="error-message">{error}</p>}
//                       </div>
//                     </div>
//                   )}

//                   {/* Success message */}
//                   {attendanceMarked && (
//                     <p className="success-message visible">
//                       Your attendance for today is marked as {attendance}.
//                     </p>
//                   )}
//                 </div>

//                 <div className='change-password-container'>
//                   <div className='secure-heading'>
//                     <h3>Secure your account</h3>
//                   </div>
//                   <div className='secure-paragraph'>
//                     <p>Change your password to make your account secure!</p>
//                   </div>
//                   <div className='secure-button'>
//                     <button>Change Password</button>
//                   </div>

//                 </div>

//                 {/* Other components */}
//               </div>
//             </>
//           )}
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard2;








// import React, { useState } from 'react';
// import './Dashboard2.css'; // Import the CSS file
// import Header from '../Header/Header';
// import EmpSidebar from '../EmployeeSidebar/EmpSidebar';
// import { Outlet, useLocation } from 'react-router-dom';

// const Dashboard2 = () => {
//   const location = useLocation();

//   // Check if the current route matches the base dashboard route
//   const isBaseRoute = location.pathname === '/dashboard2';

//   const [showAttendanceContainer, setShowAttendanceContainer] = useState(true);
//   const [attendanceMarked, setAttendanceMarked] = useState(false);
//   const [attendance, setAttendance] = useState(null);
//   const [error, setError] = useState(null);
//   const currentDate = new Date().toISOString().split('T')[0]; // Use ISO format date without time

//   const handleMarkAttendanceClick = () => {
//     console.log("Mark Attendance button clicked");
//     setShowAttendanceContainer(true);
//     setAttendanceMarked(false);
//   };

//   const markAttendance = async (status) => {
//     console.log(`Marking attendance: ${status}`);
//     const employeeId = localStorage.getItem('employeeId'); // Retrieve employee ID from localStorage

//     if (!employeeId) {
//       alert("Employee ID not found. Please log in again.");
//       return;
//     }

//     const attendanceData = {
//       employeeId,
//       date: currentDate,
//       status
//     };

//     try {
//       const response = await fetch('http://localhost:5000/api/attendance', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(attendanceData),
//       });

//       if (response.ok) {
//         console.log("Attendance marked successfully");
//         setAttendanceMarked(true);
//         setTimeout(() => {
//           setShowAttendanceContainer(false);
//         }, 1000); // Adjust the timeout to match your fade-out animation duration
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message);
//         alert("Failed to mark attendance. Attendance for that date is already registered.");
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className='emp-dashboard-container'>
//         <div className='emp-sidebar'>
//           <EmpSidebar />
//         </div>
//         <div className='emp-content'>
//           {isBaseRoute && (
//             <>
//               <div className="emp-heading">
//                 <h2>Welcome to EMPLOYEE Payroll Management System!</h2>
//                 <p className="emp-guide-text">
//                   Thank you for logging in. Here, you can manage all your payroll-related tasks efficiently.
//                   Explore the sidebar to access various features such as contact information, employee list,
//                   registration, and more.
//                 </p>
//               </div>

//               <div className='emp-dashboard-things'>
//                 <div className='whole-attendance-container'>
//                   {/* Button to show attendance container */}
//                   <button onClick={handleMarkAttendanceClick} className="attendance-button">Mark Attendance</button>

//                   {showAttendanceContainer && (
//                     <div className={`attendance-container ${attendanceMarked ? 'fade-out' : ''}`}>
//                       <div className="attendance-menu">
//                         <p>Today's Date: {currentDate}</p>
//                         <div className='attendanceOptions'>
//                           <button className="attendance-option" onClick={() => markAttendance("Present")}>Present</button>
//                           <button className="attendance-option" onClick={() => markAttendance("Absent")}>Absent</button>
//                           <button className="attendance-option" onClick={() => markAttendance("Leave")}>Leave</button>
//                         </div>
//                         {error && <p className="error-message">{error}</p>}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className='change-password-container'>
//                   <div className='secure-heading'>
//                     <h3>Secure your account</h3>
//                   </div>
//                   <div className='secure-paragraph'>
//                     <p>Change your password to make your account secure!</p>
//                   </div>
//                   <div className='secure-button'>
//                     <button>Change Password</button>
//                   </div>

//                 </div>



//               </div>
//             </>
//           )}
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard2;

