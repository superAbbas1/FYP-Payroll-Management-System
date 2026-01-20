import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewSalary.css';

const ViewSalary = () => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [viewSalaryInfo, setViewSalaryInfo] = useState(false);
  const [outAnimation, setOutAnimation] = useState(false);
  const [inAnimation, setInAnimation] = useState(false);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch designations when a department is selected
  useEffect(() => {
    const fetchDesignations = async () => {
      if (!selectedDepartment) return;

      console.log(`Fetching designations for department ID: ${selectedDepartment}`);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/departments/${selectedDepartment}/designations`
        );
        console.log('Designations fetched:', response.data);
        setDesignations(response.data);
      } catch (error) {
        console.error('Failed to fetch designations:', error);
      }
    };

    fetchDesignations();
  }, [selectedDepartment]);

  // Fetch employees when a designation is selected
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedDepartment || !selectedDesignation) return;

      try {
        const response = await axios.get('http://localhost:5000/employeeslist', {
          params: {
            departmentId: selectedDepartment,
            designation: selectedDesignation,
          },
        });

        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };

    fetchEmployees();
  }, [selectedDepartment, selectedDesignation]);

  // Fetch salary records when an employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      fetchSalaryRecords(selectedEmployee);
    }
  }, [selectedEmployee]);

  // Fetch salary records for a specific employee
  const fetchSalaryRecords = async (employeeId) => {
    try {
      console.log(`Fetching salary records for employee ID: ${employeeId}`);
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}/salaries`);

      if (!response.ok) {
        const errorText = await response.text(); // Get error text for debugging
        throw new Error(`Failed to fetch salary records: ${errorText}`);
      }

      const data = await response.json();
      console.log('Salary records fetched:', data); // Log fetched data
      setSalaryRecords(data);
    } catch (error) {
      console.error('Error fetching salary records:', error);
    }
  };


  // Calculate income tax based on salary
  const calculateIncomeTax = (salary) => {
    const incomeTaxSlabs = [
      { minIncome: 0, maxIncome: 50000, taxRate: 0 },
      { minIncome: 50001, maxIncome: 100000, taxRate: 0.025 },
      { minIncome: 100001, maxIncome: Infinity, taxRate: 0.05 }
    ];

    let tax = 0;
    for (let i = 0; i < incomeTaxSlabs.length; i++) {
      const slab = incomeTaxSlabs[i];
      if (salary > slab.maxIncome) {
        tax += (slab.maxIncome - slab.minIncome) * slab.taxRate;
      } else {
        tax += (salary - slab.minIncome) * slab.taxRate;
        break;
      }
    }
    return tax;
  };

  // Calculate net salary after deductions
  const calculateNetSalary = (salary) => {
    const incomeTax = calculateIncomeTax(salary);
    const providentFund = salary * 0.1; // 10% provident fund deduction
    return salary - incomeTax - providentFund;
  };

  // Handlers for filter selection
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedDesignation('');
    setSelectedEmployee('');
    setDesignations([]);  // Reset designations
    setEmployees([]);
    setSalaryRecords([]);
  };

  const handleDesignationChange = (event) => {
    setSelectedDesignation(event.target.value);
    setSelectedEmployee('');
    setEmployees([]);
    setSalaryRecords([]);
  };

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    setSelectedEmployee(employeeId);
    setSalaryRecords([]);

    const selectedEmployee = employees.find(emp => emp._id === employeeId);
    if (selectedEmployee) {
      setEmployeeName(`${selectedEmployee.fname} ${selectedEmployee.lname}`);
    } else {
      setEmployeeName('');
    }
  };


  // Function to format date into year and month
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateStr);
      return { year: 'N/A', month: 'N/A' };
    }
    return {
      year: date.getFullYear(),
      month: date.toLocaleString('default', { month: 'long' })
    };
  };

  const handleViewSalaryInfo = () => {
    setViewSalaryInfo(true);
    setOutAnimation(false);
  };
  const handleHideSalaryInfo = () => {
    setOutAnimation(true);
    setTimeout(() => {
      setViewSalaryInfo(false);
      setOutAnimation(false);
    }, 200);
  };

  return (
    <div className="admin-view-salary-container">
      <h2>View Salary</h2>
      <div className="filter-line grid-3-col">
        <div className="filter-item">
          <label>Department:</label>
          <select value={selectedDepartment} onChange={handleDepartmentChange}>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Designation:</label>
          <select
            value={selectedDesignation}
            onChange={handleDesignationChange}
            disabled={!selectedDepartment}
          >
            <option value="">Select Designation</option>
            {designations.map((desig, index) => (
              <option key={index} value={desig}>
                {desig}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Employee Name:</label>
          <select
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            disabled={!selectedDepartment || !selectedDesignation}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.fname} {emp.lname} - cnic:({emp.cnic})
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedEmployee && salaryRecords.length > 0 && (
        <div className="salary-info">
          <h3>Salary Information</h3>
          <table className="salary-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Gross Salary (PKR)</th>
                <th className='hide-in-mobile-table'>Income Tax</th>
                <th className='hide-in-mobile-table'>Provident Fund</th>
                <th>Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {salaryRecords.map((record, index) => {
                const { year, month } = formatDate(record.date);
                return (
                  <tr key={index}>
                    <td>{record.month}</td>
                    <td>{record.salary}</td>
                    <td className='hide-in-mobile-table'>{calculateIncomeTax(record.salary)}</td>
                    <td className='hide-in-mobile-table'>{(record.salary * 0.1).toFixed(2)}</td>
                    <td>{calculateNetSalary(record.salary)}</td>
                    <td className="view-salary-info">
                      <div
                        className="view-salary-info-wrapper view-in-mobile-only"
                        onMouseEnter={handleViewSalaryInfo}
                        onMouseLeave={handleHideSalaryInfo}
                      >
                        <div className='mobile-view-salary-info mobile-view-salary-info-wrapper'>
                          <span className='view-in-mobile-only'><strong>Income Tax:</strong> {calculateIncomeTax(record.salary)}</span>
                          <span className='view-in-mobile-only'><strong>Provident Funds:</strong> {(record.salary * 0.1).toFixed(2)}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ViewSalary;
