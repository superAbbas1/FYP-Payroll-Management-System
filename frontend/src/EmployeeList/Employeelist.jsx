import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./Employeelist.css";

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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
  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
    console.log(`View employee with id: ${employee._id}`);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
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
    <div className="employee-list-container">
      <h2 className="headerEmpList">Employee List</h2>
      <div className="employee-list-search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search employees"
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
      </div>
      <p className="total">Total number of employees: {filteredEmployees.length}</p>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th className="hide-in-mobile-table">Department</th>
            <th className="hide-in-mobile-table">Designation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="employee-datalist">
          {filteredEmployees.map((employee, index) => (
            <tr key={employee._id} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{employee.employeeID}</td>
              <td>{employee.fname}</td>
              <td className="hide-in-mobile-table">{employee.department || 'Unknown'}</td>
              <td className="hide-in-mobile-table">{employee.designation}</td>
              <td>
                <button
                  className="employee-action-button"
                  onClick={() => openConfirmDelete(employee)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                  </svg>
                </button>

                <button
                  className="employee-action-button"
                  onClick={() => handleEdit(employee)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
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
          className="employee-delete-modal"
          overlayClassName="employee-delete-overlay"
        >
          <div className="employee-delete-modal-content">
            <h2>Confirm Deletion</h2>
            <p>Do you really want to delete this employee?</p>
            <button className="employee-delete-modal-confirm" onClick={confirmDelete}>Yes</button>
            <button className="employee-delete-modal-cancel" onClick={closeConfirmDelete}>No</button>
          </div>
        </Modal>
      )}


      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Employee"
        className="edit-employee-modal"
        overlayClassName="edit-employee-overlay"
      >
        {selectedEmployee && (
          <div className="edit-employee-modal-content">
            <h2>Edit Employee Information</h2>
            <h4>Personal Information</h4>
            <div className="edit-employee-modal-row grid-3-col">
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
            </div>

            <h4>Contact Information</h4>
            <div className="edit-employee-modal-row grid-2-col">
              <label>
                Phone Number:
                <input type="text" name="phoneNum" value={selectedEmployee.phoneNum} onChange={handleChange} />
              </label>
              <label>
                City:
                <input type="text" name="city" value={selectedEmployee.city} onChange={handleChange} />
              </label>
              <label>
                Address
                <input type="text" name="email" value={selectedEmployee.address} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input type="text" name="email" value={selectedEmployee.email} onChange={handleChange} />
              </label>
            </div>

            <h4>In-Company Details</h4>
            <div className="edit-employee-modal-row grid-2-col">
              <label>
                Department:
                <select name="department" value={selectedEmployee.department} onChange={handleChange}>
                  {departments.map(department => (
                    <option key={department._id} value={department.name}>{department.name}</option>
                  ))}
                </select>
              </label>
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
                Status:
                <input type="text" name="bankName" value={selectedEmployee.status} onChange={handleChange} />
              </label>
              <label>
                Joining Date
                <input type="date" name="bankName" value={selectedEmployee.joining} onChange={handleChange} />
              </label>
            </div>



            <h4>Bank Account Information</h4>
            <div className="edit-employee-modal-row grid-3-col">
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
            </div>

            <button className="edit-employee-modal-save" onClick={handleSave}>Save</button>
            <button className="edit-employee-modal-close" onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default EmployeeList;
