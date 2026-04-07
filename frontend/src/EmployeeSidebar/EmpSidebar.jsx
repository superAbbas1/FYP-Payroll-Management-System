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

const EmpSidebar = ({ className = '' }) => {

  const [showMenu, setShowMenu] = useState(false);


  const currentDate = new Date().toLocaleDateString();

  return (
    <div className={`sidebar${className}`}>
      <ul className="sidebar-menu">

        <li>

          <div><NavLink className="sidebar-link" to="/employee" activeClassName="active">
            <div className='icon' ><img src={dashboard} alt="" /></div>
            Dashboard
          </NavLink></div>
        </li>

        <li>
          <div><NavLink className="sidebar-link" to="/employee/profile" activeClassName="active">
            <div className='icon' ><img src={profile} alt="" /></div>
            Profile
          </NavLink></div>
        </li>

        <li>
          <div> <NavLink className="sidebar-link" to="/employee/employee-attandance" activeClassName="active">
            <div className='icon'> <img src={attendance} alt="" /></div>
            View Attandance
          </NavLink></div>

        </li>

        <li>

          <div><NavLink className="sidebar-link" to="/employee/employee-salary" activeClassName="active">
            <div className='icon'><img src={salary} alt="" /></div>
            View Salary
          </NavLink></div>
        </li>

        <li>

          <div><NavLink className="sidebar-link" to="/employee/employee-pf" activeClassName="active">
            <div className='icon'><img src={pf} alt="" /></div>
            View Provident Funds
          </NavLink></div>
        </li>

        <li>

          <div><NavLink className="sidebar-link" to="/employee/employee-leaves" activeClassName="active">
            <div className='icon'><img src={leave} alt="" /></div>
            Leaves Update
          </NavLink></div>
        </li>


        <li>

          <div><NavLink className="sidebar-link" to="/employee/employee-loan" activeClassName="active">
            <div className='icon'><img src={loan} alt="" /></div>
            Loans Update
          </NavLink></div>
        </li>



      </ul>
    </div>
  );
}

export default EmpSidebar;
