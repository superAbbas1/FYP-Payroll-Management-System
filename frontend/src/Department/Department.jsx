import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Department.css";
import AddDepartmentPopup from "./AddDepartmentPopup";
import AddDesignationPopup from "./AddDesignationPopup";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showDesignationPopup, setShowDesignationPopup] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [editDescription, setEditDescription] = useState({
    id: null,
    description: "",
  });

  // Fetch departments on initial render
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Toggle Add Department popup
  const togglePopup = () => setShowPopup(!showPopup);

  // Toggle Add Designation popup
  const toggleDesignationPopup = (department, designation) => {
    setSelectedDepartment(department);
    setSelectedDesignation(designation);
    setShowDesignationPopup(!showDesignationPopup);
  };

  // Save a new department
  const handleSaveDepartment = (newDepartment) => {
    setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);
  };

  // Save a new designation
  const handleSaveDesignation = async (newDesignation) => {
    try {
      const updatedDepartment = {
        ...selectedDepartment,
        designations: [...selectedDepartment.designations, newDesignation],
      };
      const response = await axios.put(
        `http://localhost:5000/api/departments/${selectedDepartment._id}`,
        updatedDepartment
      );
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept._id === selectedDepartment._id ? response.data : dept
        )
      );
      setShowDesignationPopup(false); // Close the popup
    } catch (error) {
      console.error("Failed to save designation:", error);
    }
  };

  // Edit department description
  const handleEditDescription = async () => {
    try {
      const updatedDepartment = {
        ...departments.find((dept) => dept._id === editDescription.id),
        description: editDescription.description,
      };
      const response = await axios.put(
        `http://localhost:5000/api/departments/${editDescription.id}`,
        updatedDepartment
      );
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept._id === editDescription.id ? response.data : dept
        )
      );
      setEditDescription({ id: null, description: "" });
    } catch (error) {
      console.error("Failed to edit description:", error);
    }
  };

  // Delete designation
  const handleDeleteDesignation = async (department, designationToDelete) => {
    try {
      const updatedDesignations = department.designations.filter(
        (desig) => desig !== designationToDelete
      );
      const updatedDepartment = {
        ...department,
        designations: updatedDesignations,
      };
      const response = await axios.put(
        `http://localhost:5000/api/departments/${department._id}`,
        updatedDepartment
      );
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept._id === department._id ? response.data : dept
        )
      );
    } catch (error) {
      console.error("Failed to delete designation:", error);
    }
  };

  // Delete department
  const handleDeleteDepartment = async (departmentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/departments/${departmentId}`);
      setDepartments((prevDepartments) =>
        prevDepartments.filter((dept) => dept._id !== departmentId)
      );
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  return (
    <div className="department-container">
      <div className="Departmentheader">
        <h2>Departments and Designations</h2>
        <button className="add-button" onClick={togglePopup}>
          Add New Department
        </button>
      </div>
      <table className="department-table">
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Designations</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <React.Fragment key={dept._id}>
              <tr>
                <td>{dept.name}</td>
                <td>
                  <ul>
                    {dept.designations.map((designation, index) => (
                      <li key={index}>
                        {designation}
                        <span className="action-icons">
                          <FaTrash
                            className="delete-icon"
                            onClick={() =>
                              handleDeleteDesignation(dept, designation)
                            }
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="add-designation-button"
                    onClick={() => toggleDesignationPopup(dept, null)}
                  >
                    Add Designation
                  </button>
                </td>
                <td>
                  <div className="description-container">
                    {editDescription.id === dept._id ? (
                      <div className="description-edit-container">
                        <textarea
                          value={editDescription.description}
                          onChange={(e) =>
                            setEditDescription({
                              ...editDescription,
                              description: e.target.value,
                            })
                          }
                        />
                        <button onClick={handleEditDescription}>Save</button>
                      </div>
                    ) : (
                      <div className="description-view-container">
                        <p>{dept.description}</p>
                        <FaPencilAlt
                          className="edit-icon"
                          onClick={() =>
                            setEditDescription({
                              id: dept._id,
                              description: dept.description,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDeleteDepartment(dept._id)}
                  />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <AddDepartmentPopup
          onClose={togglePopup}
          onSave={handleSaveDepartment}
        />
      )}
      {showDesignationPopup && selectedDepartment && (
        <AddDesignationPopup
          department={selectedDepartment}
          designation={selectedDesignation}
          onSave={handleSaveDesignation}
          onClose={() => setShowDesignationPopup(false)}
        />
      )}
    </div>
  );
};

export default Department;
