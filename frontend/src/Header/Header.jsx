import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../login/logo-white.png';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="Mainheader">
       <div className='logo-container'><img className='logo' src={logo} alt="" /></div>
      <div><h1>Payroll Management System</h1></div>
     
      
      <div className='logout-button'><button onClick={handleLogout}>Logout</button></div>
      
    </div>
  );
};

export default Header;
