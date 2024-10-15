// Sidebar.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import attendance from './icons/attendance.png';
import pf from './icons/pf.png';
import salary from './icons/salary.png';
import leave from './icons/leave.png';
import addDept from './icons/addDept.png';
import loan from './icons/loan.png';
import edit from './icons/editSalary.png';
import view from './icons/viewSalary.png';
import reg from './icons/registration.png';
import empList from './icons/employeeList.png'
import dashboard from './icons/dashboard.png';


import "./Sidebar.css";

const Sidebar = () => {

  const [salaryOpen, setSalaryOpen] = useState(false);


  const toggleSalaryMenu = () => {
    setSalaryOpen(!salaryOpen);
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">

        <li>

          <div> <NavLink className="sidebar-link" to="/dashboard3" activeClassName="active">
            <div className='icon'><img src={dashboard} alt="" /></div>
            Dashboard
          </NavLink></div>
        </li>


        <li>

          <div> <NavLink className="sidebar-link" to="/dashboard3/registration" activeClassName="active">
            <div className='icon'><img src={reg} alt="" /></div>
            Registration
          </NavLink></div>
        </li>



        <li>

          <div> <NavLink className="sidebar-link" to="/dashboard3/employeelist" activeClassName="active">
            <div className='icon'><img src={empList} alt="" /></div>
            Employee List
          </NavLink></div>
        </li>


        <li>

          <div> <NavLink className="sidebar-link" to="/dashboard3/department" activeClassName="active">
            <div className='icon'><img src={addDept} alt="" /></div>
            Manage Departments
          </NavLink></div>
        </li>

        <li>

          <div> <NavLink className="sidebar-link" to="/dashboard3/view-attandance-employee" activeClassName="active">
            <div className='icon'><img src={attendance} alt="" /></div>
            View Attandance
          </NavLink></div>
        </li>



        <li>
          <div> <NavLink className="sidebar-link" to="/dashboard3/salary/edit" activeClassName="active">
            <div className='icon'><img src={edit} alt="" /></div>
            Edit Salary
          </NavLink></div>
        </li>


        <li>
          <div>  <NavLink className="sidebar-link" to="/dashboard3/salary/view" activeClassName="active">
            <div className='icon'><img src={view} alt="" /></div>
            View Salary

          </NavLink></div>
        </li>

        <li>

          <div> <NavLink className="sidebar-link" to="/dashboard3/salary/pf" activeClassName="active">
            <div className='icon'><img src={pf} alt="" /></div>
            Provident Funds
          </NavLink></div>
        </li>

        <li>

          <div>  <NavLink className="sidebar-link" to="/dashboard3/salary/loan" activeClassName="active">
            <div className='icon'><img src={loan} alt="" /></div>
            Loan
          </NavLink></div>
        </li>

        <li>

          <div><NavLink className="sidebar-link" to="/dashboard3/salary/leaves" activeClassName="active">
            <div className='icon'><img src={leave} alt="" /></div>
            Leaves
          </NavLink></div>
        </li>



      </ul>
    </div >
  );
}

export default Sidebar;
