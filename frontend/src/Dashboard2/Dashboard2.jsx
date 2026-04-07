import React, { useState } from 'react';
import './Dashboard2.css';
import Header from '../Header/Header';
import { Outlet, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';


const Dashboard2 = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === '/employee';

  const [showAttendanceContainer, setShowAttendanceContainer] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];

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
      // const encryptedPassword = AES.encrypt(newPassword, "bsjdsab12bsandb213").toString();
      // console.log("naya apassowrd: ", encryptedPassword);
      // Update password in the database
      console.log("hellooo bhai");
      const updateResponse = await fetch(`http://localhost:5000/api/employees/${employeeId}/updatePassword`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

              <div className='emp-dashboard-feature-container'>
                <div className='mark-attendance-container'>
                  <h3>Mark Attendance</h3>
                  {showAttendanceContainer && (
                    <div className={`attendance-container ${attendanceMarked ? 'fade-out' : ''}`}>
                      <div className={`attendance-menu ${attendanceMarked ? '' : 'visible'}`}>
                        <p>Date Today: {currentDate}</p>
                        <div className='attendance-options'>
                          <button className="main-button" onClick={() => markAttendance("Present")}>Present</button>
                          <button className="main-button" onClick={() => markAttendance("Absent")}>Absent</button>
                          <button className="main-button" onClick={() => markAttendance("Leave")}>Leave</button>
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
                  <h3>Secure your account</h3>
                  <p>Change your password to make your account secure!</p>
                  <button className='main-button-2' onClick={handleOpenPasswordModal}>Change Password</button>
                </div>
              </div>
            </>
          )}
          <Outlet />
        </div>
      </div>

      {/* Password Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} contentLabel="Change Password" className="change-password-modal" overlayClassName="overlay">
        <div className="change-password-modal-content">
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
          <button className="main-button" onClick={handleUpdatePassword}>Update Password</button>
          <button className="close-button" onClick={handleCloseModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard2;