import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const employeeID = localStorage.getItem('employeeId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching data for employee ID:', employeeID);
        const response = await fetch(`http://localhost:5000/api/user/${employeeID}`);
        const data = await response.json();

        console.log('Fetched user data:', data);
        setUserData(data);
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
      <h3>Personal Information</h3>
      <div className="profile-details grid-1-col">
        <p className='grid-2-col'><strong>First Name:</strong> <span>{userData.fname}</span></p>
        <p className='grid-2-col'><strong>Last Name:</strong> <span>{userData.lname}</span></p>
        <p className='grid-2-col'><strong>CNIC:</strong> <span>{userData.cnic}</span></p>
      </div>

      <h3>Contact Information</h3>
      <div className="profile-details grid-1-col">
        <p className='grid-2-col'><strong>Phone Number:</strong> <span>{userData.phoneNum}</span></p>
        <p className='grid-2-col'><strong>City:</strong> <span>{userData.city}</span></p>
        <p className='grid-2-col'><strong>Address:</strong> <span>{userData.address}</span></p>
      </div>

      <h3>In-Company Details & Joining Date</h3>
      <div className="profile-details grid-1-col">
        <p className='grid-2-col'><strong>Department:</strong> <span>{userData.department}</span></p>
        <p className='grid-2-col'><strong>Designation:</strong> <span>{userData.designation}</span></p>
        <p className='grid-2-col'><strong>Status:</strong> <span>{userData.status}</span></p>
        <p className='grid-2-col'><strong>Joining Date:</strong> <span>{userData.joining}</span></p>
      </div>

      <h3>Bank Account Information</h3>
      <div className="profile-details grid-1-col">
        <p className='grid-2-col'><strong>Bank Name:</strong> <span>{userData.bankName}</span></p>
        <p className='grid-2-col'><strong>Account Name:</strong> <span>{userData.accountName}</span></p>
        <p className='grid-2-col'><strong>Account Number:</strong> <span>{userData.accountNum}</span></p>
      </div>
    </div>
  );
};

export default Profile;
