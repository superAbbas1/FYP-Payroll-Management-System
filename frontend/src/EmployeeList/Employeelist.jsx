import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Employeelist.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/employees")
      .then((res) => {
        setEmployees(res.data);
        console.log("Fetched employees:", res.data); // Log the fetched employees data
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then((res) => {
        setEmployees(employees.filter(employee => employee._id !== id));
      })
      .catch((err) => {
        console.log(err);
        alert(`Failed to delete employee: ${err.message}`);
      });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredEmployees = employees.filter(employee => 
    employee.fname.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    employee.lname.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="header">Employee List</h2>
      <input 
        type="text" 
        className="search-bar" 
        placeholder="Search employees..." 
        value={searchQuery} 
        onChange={handleSearch} 
      />
      <p className="total">Total number of employees: {filteredEmployees.length}</p>
      <ul className="list">
        {filteredEmployees.map((employee, index) => (
          <li 
            key={employee._id} 
            className={`list-item ${index % 2 === 0 ? 'even' : 'odd'}`}
          >
            {employee.fname} {employee.lname} - {employee.email}
            <button 
              className="delete-button" 
              onClick={() => handleDelete(employee._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
