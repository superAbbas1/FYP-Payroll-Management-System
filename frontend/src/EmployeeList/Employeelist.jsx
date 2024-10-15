import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./EmployeeList.css";

Modal.setAppElement('#root'); // Setting app element for accessibility

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);


  useEffect(() => {
    // Fetch employees
    axios.get("http://localhost:5000/employeeslist")
      .then((res) => {
        setEmployees(res.data);
        console.log("Fetched employees:", res.data); // Log the fetched employees data
      })
      .catch((err) => console.log(err));

    // Fetch departments
    axios.get("http://localhost:5000/api/departments")
      .then((res) => {
        setDepartments(res.data);
        console.log("Fetched departments:", res.data); // Log the fetched departments data
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Update designations based on selected department
    const department = departments.find(dept => dept.name === selectedDepartment);
    setDesignations(department ? department.designations : []);
  }, [selectedDepartment, departments]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(employee => employee._id !== id));
      })
      .catch((err) => {
        console.log(err);
        alert(`Failed to delete employee: ${err.message}`);
      });
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    console.log(`Edit employee with id: ${employee._id}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedDesignation(""); // Reset designation when department changes
  };

  const handleDesignationChange = (event) => {
    setSelectedDesignation(event.target.value);
  };



  const openConfirmDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsConfirmDeleteOpen(true);
  };

  const closeConfirmDelete = () => {
    setIsConfirmDeleteOpen(false);
    setEmployeeToDelete(null);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      handleDelete(employeeToDelete._id);
    }
    closeConfirmDelete();
  };




  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!selectedEmployee || !selectedEmployee._id) {
      console.error("No employee selected or missing employee ID");
      return;
    }


    const employeeId = selectedEmployee._id;
    console.log(`Saving employee with id: ${employeeId}`); // Log the employee ID being saved

    axios.put(`http://localhost:5000/employees/${employeeId}`, selectedEmployee)
      .then((res) => {
        setEmployees(employees.map(emp => (emp._id === selectedEmployee._id ? res.data : emp)));
        closeModal();
      })
      .catch((err) => {
        console.error("Failed to update employee:", err);
        alert(`Failed to update employee: ${err.message}`);
      });
  };

  // Filter employees based on search query, department, and designation
  const filteredEmployees = employees
    .filter(employee =>
      (employee.fname && employee.fname.toLowerCase().startsWith(searchQuery.toLowerCase())) ||
      (employee.lname && employee.lname.toLowerCase().startsWith(searchQuery.toLowerCase())) ||
      (employee.email && employee.email.toLowerCase().startsWith(searchQuery.toLowerCase()))
    )
    .filter(employee =>
      (selectedDepartment === "" || employee.department === selectedDepartment) &&
      (selectedDesignation === "" || employee.designation === selectedDesignation)
    );

  return (
    <div className="container">
      <h2 className="headerEmpList">Employee List</h2>
      <input
        type="text"
        className="search-bar"
        placeholder="Search employees..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <select
        className="department-filter"
        value={selectedDepartment}
        onChange={handleDepartmentChange}
      >
        <option value="">All Departments</option>
        {departments.map(department => (
          <option key={department._id} value={department.name}>{department.name}</option>
        ))}
      </select>
      <select
        className="designation-filter"
        value={selectedDesignation}
        onChange={handleDesignationChange}
        disabled={!selectedDepartment}
      >
        <option value="">All Designations</option>
        {designations.map(designation => (
          <option key={designation} value={designation}>{designation}</option>
        ))}
      </select>
      <p className="total">Total number of employees: {filteredEmployees.length}</p>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee._id} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{employee.employeeID}</td>
              <td>{employee.fname}</td>
              <td>{employee.lname}</td>
              <td>{employee.department || 'Unknown'}</td> {/* Display the department name */}
              <td>{employee.designation}</td>
              <td>{employee.status}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => openConfirmDelete(employee)}
                >
                  Delete
                </button>

                <button
                  className="edit-button"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isConfirmDeleteOpen && (
        <Modal
          isOpen={isConfirmDeleteOpen}
          onRequestClose={closeConfirmDelete}
          contentLabel="Confirm Delete"
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Do you really want to delete this employee?</p>
            <button className="modal-confirm" onClick={confirmDelete}>Yes</button>
            <button className="modal-cancel" onClick={closeConfirmDelete}>No</button>
          </div>
        </Modal>
      )}




      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Employee"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedEmployee && (
          <div className="modal-content">
            <h2>Edit Employee Information</h2>
            <div className="modal-row">
              <label>
                First Name:
                <input type="text" name="fname" value={selectedEmployee.fname} onChange={handleChange} />
              </label>
              <label>
                Last Name:
                <input type="text" name="lname" value={selectedEmployee.lname} onChange={handleChange} />
              </label>

              <label>
                CNIC:
                <input type="text" name="cnic" value={selectedEmployee.cnic} onChange={handleChange} />
              </label>

              <label>
                Department:
                <select name="department" value={selectedEmployee.department} onChange={handleChange}>
                  {departments.map(department => (
                    <option key={department._id} value={department.name}>{department.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="modal-row">
              <label>
                Designation:
                <select name="designation" value={selectedEmployee.designation} onChange={handleChange}>
                  {departments
                    .find(dept => dept.name === selectedEmployee.department)
                    ?.designations
                    .map(designation => (
                      <option key={designation} value={designation}>{designation}</option>
                    ))}
                </select>
              </label>
              <label>
                City:
                <input type="text" name="city" value={selectedEmployee.city} onChange={handleChange} />
              </label>
              <label>
                Phone Number:
                <input type="text" name="phoneNum" value={selectedEmployee.phoneNum} onChange={handleChange} />
              </label>

              <label>
                Bank Name:
                <input type="text" name="bankName" value={selectedEmployee.bankName} onChange={handleChange} />
              </label>
              <label>
                Account Name:
                <input type="text" name="accountName" value={selectedEmployee.accountName} onChange={handleChange} />
              </label>
              <label>
                Account Number:
                <input type="text" name="accountNum" value={selectedEmployee.accountNum} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input type="text" name="email" value={selectedEmployee.email} onChange={handleChange} />
              </label>


            </div>
            <button className="modal-save" onClick={handleSave}>Save</button>
            <button className="modal-close" onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeList;
