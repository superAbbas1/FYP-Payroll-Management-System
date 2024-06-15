// Sidebar.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import "./Sidebar.css";

const Sidebar = () => {
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const toggleAttendanceMenu = () => {
    setAttendanceOpen(!attendanceOpen);
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink className="sidebar-link" to="/dashboard/view-attandance-employee" activeClassName="active">
            View Attandance
          </NavLink>
        </li>
        <li>
          <NavLink className="sidebar-link" to="/dashboard/view-salary-employee" activeClassName="active">
            View Salary
          </NavLink>
        </li>
        <li>
          <NavLink className="sidebar-link" to="/dashboard/employeelist" activeClassName="active">
            Employee List
          </NavLink>
        </li>
        <li>
          <NavLink className="sidebar-link" to="/dashboard/registration" activeClassName="active">
            Registration
          </NavLink>
        </li>
        <li>
          <button className="sidebar-link-button" onClick={toggleAttendanceMenu}>
            Edit/View Attendance {attendanceOpen ? "▲" : "▼"}
          </button>
          {attendanceOpen && (
            <ul className="sidebar-submenu">
              <li>
                <NavLink className="sidebar-link" to="/dashboard/attendance/edit" activeClassName="active">
                  Edit Attendance
                </NavLink>
              </li>
              <li>
                <NavLink className="sidebar-link" to="/dashboard/attendance/view" activeClassName="active">
                  View Attendance
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
