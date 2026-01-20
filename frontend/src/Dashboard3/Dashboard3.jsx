import React, { useEffect, useState } from 'react';
import './Dashboard3.css';
import Header from '../Header/Header';
import { Outlet, useLocation } from 'react-router-dom';

const Dashboard3 = () => {
    const location = useLocation();
    const [employeeCount, setEmployeeCount] = useState(0);
    const [departmentCount, setDepartmentCount] = useState(0);
    const [employeeDisplay, setEmployeeDisplay] = useState(0);
    const [departmentDisplay, setDepartmentDisplay] = useState(0);

    const isBaseRoute = location.pathname === '/admin/dashboard';

    useEffect(() => {
        // Fetch the number of employees
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/employeeslist');
                const employees = await response.json();
                setEmployeeCount(employees.length);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        // Fetch the number of departments
        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/departments');
                const departments = await response.json();
                setDepartmentCount(departments.length);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchEmployees();
        fetchDepartments();
    }, []);

    useEffect(() => {
        let start = 0;
        const duration = 250; // Duration of the animation in milliseconds
        const startTime = performance.now();

        const animateCount = () => {
            const currentTime = performance.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);

            setEmployeeDisplay(Math.floor(progress * employeeCount));
            setDepartmentDisplay(Math.floor(progress * departmentCount));

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            }
        };

        requestAnimationFrame(animateCount);
    }, [employeeCount, departmentCount]);

    return (
        <>
            <Header />
            <div className='admin-dashboard-container'>
                <div className='admin-content'>
                    {isBaseRoute && (
                        <>
                            <div className="emp-heading">
                                <h2>Welcome Admin!</h2>
                                <p className="emp-guide-text">
                                    Thank you for logging in. Here, you can manage all the payroll-related tasks efficiently.
                                    Explore the sidebar to access various features such employee list,
                                    registration, and more.
                                </p>
                            </div>  

                            <div className="grid-2-col">
                                <div className="card">
                                    <h3>Number of Employees</h3>
                                    <p>{employeeDisplay}</p>
                                </div>
                                <div className="card">
                                    <h3>Number of Departments</h3>
                                    <p>{departmentDisplay}</p>
                                </div>
                            </div>

                        </>
                    )}

                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Dashboard3;