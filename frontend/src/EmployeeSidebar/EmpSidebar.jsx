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

const EmpSidebar = ({ className = '', onClose = () => {} }) => {

  return (
    <div className={`sidebar${className}`}>
      <ul className="sidebar-menu">

        <li>
          <div><NavLink className="sidebar-link" to="/employee/dashboard" onClick={() => onClose()}>
            <div className='icon' ><img src={dashboard} alt="" /></div>
            Dashboard
          </NavLink></div>
        </li>

        <li>
          <div><NavLink className="sidebar-link" to="/employee/profile" onClick={() => onClose()}>
            <div className='icon' ><img src={profile} alt="" /></div>
            Profile
          </NavLink></div>
        </li>

        <li>
          <div> <NavLink className="sidebar-link" to="/employee/mark-attendance" onClick={() => onClose()}>
            <div className='icon'> <img src={attendance} alt="" /></div>
            Mark Attendance
          </NavLink></div>
        </li>

        <li>
          <div> <NavLink className="sidebar-link" to="/employee/attandance" onClick={() => onClose()}>
            <div className='icon'> <img src={attendance} alt="" /></div>
            View Attandance
          </NavLink></div>

        </li>

        <li>

          <div><NavLink className="sidebar-link" to="/employee/salary" onClick={() => onClose()}>
            <div className='icon'><img src={salary} alt="" /></div>
            View Salary
          </NavLink></div>
        </li>

        <li>

          <div><NavLink className="sidebar-link" to="/employee/provident-fund-details" onClick={() => onClose()}>
            <div className='icon'><img src={pf} alt="" /></div>
            View Provident Funds
          </NavLink></div>
        </li>

        <li>

          <div><NavLink className="sidebar-link" to="/employee/leaves" onClick={() => onClose()}>
            <div className='icon'><img src={leave} alt="" /></div>
            Leaves Update
          </NavLink></div>
        </li>

        <li>
          <div><NavLink className="sidebar-link" to="/employee/provident-fund-loan" onClick={() => onClose()}>
            <div className='icon'><img src={loan} alt="" /></div>
            Loans Update
          </NavLink></div>
        </li>

      </ul>
    </div>
  );
}

export default EmpSidebar;
