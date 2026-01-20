import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditSalary.css';

const EditSalary = () => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDepartmentID, setSelectedDepartmentID] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [currentSalary, setCurrentSalary] = useState(''); // State for current salary
  const [enteredSalary, setEnteredSalary] = useState('');
  const [salaryChanges, setSalaryChanges] = useState([]);

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

  useEffect(() => {
    const fetchDesignations = async () => {
      if (!selectedDepartment) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/departments/${selectedDepartmentID}/designations`
        );
        setDesignations(response.data);
      } catch (error) {
        console.error('Failed to fetch designations:', error);
      }
    };

    fetchDesignations();
  }, [selectedDepartment]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedDepartment || !selectedDesignation) return;

      try {
        const response = await axios.get('http://localhost:5000/employeeslist', {
          params: {
            department: selectedDepartment,
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

  useEffect(() => {
    const fetchSalary = async () => {
      if (!selectedEmployee) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/salary/${selectedEmployee}`
        );
        setCurrentSalary(response.data.salary || ''); // Set the current salary
        setEnteredSalary(response.data.salary || ''); // Set entered salary to current by default
      } catch (error) {
        console.error('Failed to fetch salary:', error);
        setCurrentSalary('');
        setEnteredSalary('');
      }
    };

    fetchSalary();
  }, [selectedEmployee]);

  const handleDepartmentChange = (event) => {
    const selectedDeptId = event.target.value;
    const selectedDept = departments.find(dept => dept._id === selectedDeptId);
    setSelectedDepartmentID(selectedDeptId);
    setSelectedDepartment(selectedDept.name);  // Use name if you want the name in state
    setSelectedDesignation('');
    setSelectedEmployee('');
    setDesignations([]);
    setEmployees([]);
    setCurrentSalary(''); // Reset salary on department change
    setEnteredSalary('');
  };

  const handleDesignationChange = (event) => {
    setSelectedDesignation(event.target.value);
    setSelectedEmployee('');
    setEmployees([]);
    setCurrentSalary(''); // Reset salary on designation change
    setEnteredSalary('');
  };

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    setSelectedEmployee(employeeId);
    setCurrentSalary(''); // Reset salary on employee change
    setEnteredSalary('');

    const selectedEmp = employees.find(emp => emp._id === employeeId);
    if (selectedEmp) {
      setEmployeeName(`${selectedEmp.fname} ${selectedEmp.lname}`);
    } else {
      setEmployeeName('');
    }
  };

  const handleSalaryChange = (event) => {
    setEnteredSalary(event.target.value);
  };

  const handleSaveSalary = async () => {
    if (!enteredSalary) {
      alert('Please enter a salary amount.');
      return;
    }

    if (enteredSalary === currentSalary) {
      alert('The updated salary is the same as the current salary.');
      return;
    }

    const payload = {
      employeeID: selectedEmployee,
      salary: enteredSalary,
    };

    console.log('Sending payload:', payload);

    try {
      const response = await axios.post('http://localhost:5000/api/salary', payload);
      const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toLocaleString('default', { month: 'long' });
      alert(`Salary updated from ${currentSalary} to ${enteredSalary} successfully for ${nextMonth}.`);
      setCurrentSalary(enteredSalary); // Update current salary in UI
    } catch (error) {
      console.error('Failed to save salary:', error);
    }
  };


  return (
    <div className="edit-salary-container">
      <h2>Edit Salary</h2>
      <div className="edit-salary-filter-line grid-3-col">
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
            disabled={!selectedDesignation}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.fname} {emp.lname} - cnic:({emp.cnic})
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Current Salary:</label>
          <input
            type="number"
            value={currentSalary}
            disabled={!selectedEmployee}
            style={{ width: '100%' }}
          />
        </div>
        <div className="filter-item">
          <label>Updated Salary:</label>
          <input
            type="number"
            value={enteredSalary}
            disabled={!selectedEmployee}
            onChange={handleSalaryChange}
            style={{ width: '100%' }}
          />
         
        </div>
      </div>
       <button className="btn btn-primary update-salary-button" disabled={!selectedEmployee} onClick={handleSaveSalary}>
            Update Salary
          </button>

    </div>
  );
};

export default EditSalary;
