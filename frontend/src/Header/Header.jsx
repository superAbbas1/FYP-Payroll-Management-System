import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../login/logo-white.png';
import Sidebar from '../Sidebar/Sidebar'
import EmpSidebar from '../EmployeeSidebar/EmpSidebar';
import './Header.css';

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const storedRole = localStorage.getItem("userRole");
  console.log("role:", storedRole);

  const handleLogout = () => {
    navigate('/');
  };

   const handleSidebar = () =>{
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
    <header className="Mainheader">
      <div className='main-header-wrapper'>
      <button className='hamburger-button' onClick={handleSidebar}>☰</button>
       <div className='header-logo-container'><img className='logo' src={logo} alt="" /></div>
      <h1 className='header-heading'>Payroll Management System</h1>
      
      <button className='logout-button' onClick={handleLogout}>Logout</button>
      
    </div>
    </header>
    {storedRole === 'admin' ? (
      <Sidebar className={sidebarVisible ? ' sidebarVisible' : ''} />
      ) : (
         <EmpSidebar className={sidebarVisible ? ' sidebarVisible' : ''} />
      )}
    {/* <Sidebar className={sidebarVisible ? ' sidebarVisible' : ''} /> */}
    
    </>
  );
};

export default Header;