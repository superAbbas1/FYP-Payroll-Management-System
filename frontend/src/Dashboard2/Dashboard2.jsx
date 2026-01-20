import React, { useEffect, useState } from 'react';
import './Dashboard2.css';
import Header from '../Header/Header';
import { Outlet, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import axios from 'axios';

const Dashboard2 = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === '/employee/dashboard';
  // const [attendanceMarked, setAttendanceMarked] = useState(false)
  // const [attendance, setAttendance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];

  const employeeId = localStorage.getItem('employeeId');

  const handleOpenPasswordModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    }
  };

  const handleUpdatePassword = async () => {
    const employeeId = localStorage.getItem('employeeId');

    if (!employeeId) {
      alert("Employee ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`);
      const employee = await response.json();

      const decryptedPassword = AES.decrypt(employee.password, "bsjdsab12bsandb213").toString(Utf8);

      if (decryptedPassword !== currentPassword) {
        alert("Your current password is incorrect. Please try again.");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        alert("The new password and confirmation password do not match. Please try again.");
        return;
      }
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

                <div className='change-password-container'>
                  <h3>Secure your account</h3>
                  <p>Change your password to make your account secure!</p>
                  <button className='btn btn-primary' onClick={handleOpenPasswordModal}>Change Password</button>
                </div>
              </div>
            </>
          )}
          <Outlet />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} contentLabel="Change Password" className="employee-dashboard change-password-modal" overlayClassName="overlay">
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
          <div className="">
          <button className="btn btn-primary" onClick={handleUpdatePassword}>Update Password</button>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg>
          </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard2;