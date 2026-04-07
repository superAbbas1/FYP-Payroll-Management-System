import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const employeeID = localStorage.getItem('employeeId'); // Get employeeID from localStorage
  console.log("employee id frontend pr: " , employeeID);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${employeeID}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (employeeID) {
      fetchUserData();
    }
  }, [employeeID]);

  if (!userData) {
    return <div>Loading...</div>; // Loading state while data is being fetched
  }

  return (
    <div className="profile-container">
      <h1>Personal Information</h1>
      <div className="profile-details">
        <p><strong>First Name:</strong> <span>{userData.fname}</span></p>
        <p><strong>Last Name:</strong> <span>{userData.lname}</span></p>
        <p><strong>CNIC:</strong> <span>{userData.cnic}</span></p>
      </div>

      <h1>Contact Information</h1>
      <div className="profile-details">
        <p><strong>Phone Number:</strong> <span>{userData.phoneNum}</span></p>
        <p><strong>City:</strong> <span>{userData.city}</span></p>
        <p><strong>Address:</strong> <span>{userData.address}</span></p>
      </div>

      <h1>In-Company Details & Joining Date</h1>
      <div className="profile-details">
        <p><strong>Department:</strong> <span>{userData.department}</span></p>
        <p><strong>Designation:</strong> <span>{userData.designation}</span></p>
        <p><strong>Status:</strong> <span>{userData.status}</span></p>
        <p><strong>Joining Date:</strong> <span>{userData.joining}</span></p>
      </div>

      <h1>Bank Account Information</h1>
      <div className="profile-details">
        <p><strong>Bank Name:</strong> <span>{userData.bankName}</span></p>
        <p><strong>Account Name:</strong> <span>{userData.accountName}</span></p>
        <p><strong>Account Number:</strong> <span>{userData.accountNum}</span></p>
      </div>
    </div>
  );
};

export default Profile;
