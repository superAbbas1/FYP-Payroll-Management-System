// EmpSidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import attendance from './icons/attendance.png';
import profile from './icons/profile.png';
import pf from './icons/pf.png';
import salary from './icons/salary.png';
import leave from './icons/leave.png';
import dashboard from './icons/dashboard.png';
import loan from './icons/loan.png';



import "./EmpSidebar.css";

const EmpSidebar = () => {

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {/* <li>
          <div className="attendance-button-container">
            <button onClick={toggleMenu} className="attendance-button">Mark Attendance</button>
            {showMenu && (
              <>
                <div className="blur-overlay" onClick={toggleMenu}></div>
                <div className="attendance-menu">
                  <p>{currentDate}</p>
                  <button className="attendance-option">Present</button>
                  <button className="attendance-option">Absent</button>
                  <button className="attendance-option">Leave</button>
                </div>
              </>
            )}
          </div>
        </li> */}






 


        <li>
         
          <div><NavLink className="sidebar-link" to="/dashboard2" activeClassName="active">
          <div className='icon' ><img src={dashboard} alt="" /></div>
            Dashboard
          </NavLink></div>
        </li>




        <li>
         
          <div><NavLink className="sidebar-link" to="/dashboard2/profile" activeClassName="active">
          <div className='icon' ><img src={profile} alt="" /></div>
            Profile
          </NavLink></div>
        </li>

        <li>

          
          <div> <NavLink className="sidebar-link" to="/dashboard2/employee-attandance" activeClassName="active">
          <div className='icon'> <img src={attendance} alt="" /></div>
            View Attandance
          </NavLink></div>

        </li>

        <li>
         
          <div><NavLink className="sidebar-link" to="/dashboard2/employee-salary" activeClassName="active">
          <div className='icon'><img src={salary} alt="" /></div>
            View Salary
          </NavLink></div>
        </li>
        
        <li>
          
          <div><NavLink className="sidebar-link" to="/dashboard2/employee-pf" activeClassName="active">
          <div className='icon'><img src={pf} alt="" /></div>
            View Provident Funds
          </NavLink></div>
        </li>

        <li>
         
          <div><NavLink className="sidebar-link" to="/dashboard2/employee-leaves" activeClassName="active">
          <div className='icon'><img src={leave} alt="" /></div>
            Leaves Update
          </NavLink></div>
        </li>


        <li>
          
          <div><NavLink className="sidebar-link" to="/dashboard2/employee-loan" activeClassName="active">
          <div className='icon'><img src={loan} alt="" /></div>
            Loans Update
          </NavLink></div>
        </li>



      </ul>
    </div>
  );
}

export default EmpSidebar;
