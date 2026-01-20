import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import attendance from './icons/attendance.png';
import pf from './icons/pf.png';
import leave from './icons/leave.png';
import addDept from './icons/addDept.png';
import loan from './icons/loan.png';
import edit from './icons/editSalary.png';
import view from './icons/viewSalary.png';
import reg from './icons/registration.png';
import empList from './icons/employeeList.png'
import dashboard from './icons/dashboard.png';


import "./Sidebar.css";

const Sidebar = ({ className = '', onClose = () => {} }) => {

  return (
    <div className={`sidebar${className}`}>
      <ul className="sidebar-menu">

        <li>
          <div> <NavLink className="sidebar-link" to="/admin/dashboard" onClick={() => onClose()}>
            <div className='icon'><img src={dashboard} alt="" /></div>
            Dashboard
          </NavLink></div>
        </li>

        <li>
          <div> <NavLink className="sidebar-link" to="/admin/registration" onClick={() => onClose()}>
            <div className='icon'><img src={reg} alt="" /></div>
            Registration
          </NavLink></div>
        </li>

        <li>
          <div> <NavLink className="sidebar-link" to="/admin/employeelist" onClick={() => onClose()}>
            <div className='icon'><img src={empList} alt="" /></div>
            Employee List
          </NavLink></div>
        </li>


        <li>
          <div> <NavLink className="sidebar-link" to="/admin/department" onClick={() => onClose()}>
            <div className='icon'><img src={addDept} alt="" /></div>
            Manage Departments
          </NavLink></div>
        </li>

        <li>
          <div> <NavLink className="sidebar-link" to="/admin/view-attandance" onClick={() => onClose()}>
            <div className='icon'><img src={attendance} alt="" /></div>
            View Attandance
          </NavLink></div>
        </li>

        <li>
          <div> <NavLink className="sidebar-link" to="/admin/edit-salary" onClick={() => onClose()}>
            <div className='icon'><img src={edit} alt="" /></div>
            Edit Salary
          </NavLink></div>
        </li>


        <li>
          <div>  <NavLink className="sidebar-link" to="/admin/view-salary" onClick={() => onClose()}>
            <div className='icon'><img src={view} alt="" /></div>
            View Salary
          </NavLink></div>
        </li>

        <li>
          <div> <NavLink className="sidebar-link" to="/admin/view-provident-funds" onClick={() => onClose()}>
            <div className='icon'><img src={pf} alt="" /></div>
            Provident Funds
          </NavLink></div>
        </li>

        <li>
          <div>  <NavLink className="sidebar-link" to="/admin/loan-requests" onClick={() => onClose()}>
            <div className='icon'><img src={loan} alt="" /></div>
            Loan
          </NavLink></div>
        </li>

        <li>
          <div><NavLink className="sidebar-link" to="/admin/leave-requests" onClick={() => onClose()}>
            <div className='icon'><img src={leave} alt="" /></div>
            Leaves
          </NavLink></div>
        </li>

      </ul>
    </div >
  );
}

export default Sidebar;