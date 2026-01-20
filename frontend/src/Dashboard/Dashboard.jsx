import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import EmpSidebar from '../EmployeeSidebar/EmpSidebar';
import UserContext from '../Context/UserContext';
import "./Dashboard.css";

const Dashboard = () => {
  const { userRole, setUserRole } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => { 
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
    } else {
      navigate("/"); // If no role found, redirect to login
    }
  }, [setUserRole, navigate]);

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        {/* {userRole === 'admin' ? <Sidebar /> : <EmpSidebar />} */}
        <div className="main-content">
            <h2 style={{color: '#1a1a1a'}}>Welcome to Payroll Management System</h2>
            <p style={{color: '#333333'}}>You are successfully logged in as admin user</p>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
