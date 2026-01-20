import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Department.css";
import AddDepartmentPopup from "./AddDepartmentPopup";
import AddDesignationPopup from "./AddDesignationPopup";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [viewDescription, setViewDescription] = useState(false);
  const [outAnimation, setOutAnimation] = useState(false);
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

  const handleViewDescription = () => {
    setViewDescription(true);
    setOutAnimation(false);
  };
  const handleHideDescription = () => {
    setOutAnimation(true);
    setTimeout(() => {
      setViewDescription(false);
      setOutAnimation(false);
    }, 200);
  };
  
  return (
    <div className="department-container">
      <div className="Departmentheader">
        <h2>Departments and Designations</h2>
        <button className="department-add-button" onClick={togglePopup}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg> New Department
        </button>
      </div>
      <table className="department-table">
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Designations</th>
            <th className="hide-in-mobile-table">Description</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <React.Fragment key={dept._id}>
              <tr>
                <td>{dept.name}</td>
                <td>
                  <ul className="designation-list">
                    {dept.designations.map((designation, index) => (
                      <li key={index}>
                        {designation}
                        <span
                          className="designation-delete-icon"
                          onClick={() =>
                            handleDeleteDesignation(dept, designation)
                          }
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="add-designation-button"
                    onClick={() => toggleDesignationPopup(dept, null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Designation
                  </button>
                </td>
                <td className={`${viewDescription ? "designation-description-mobile-view" : ""} ${outAnimation ? "designation-description-hidden" : ""} designation-description-cell`}>
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
                        <span
                          className="edit-icon"
                          onClick={() =>
                            setEditDescription({
                              id: dept._id,
                              description: dept.description,
                            })
                          }
                        >

                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="department-action-button">
                  <div className="department-action-button__wrapper">
                    <span
                      className="view-description-icon view-in-mobile-only"
                      onMouseEnter={handleViewDescription}
                      onMouseLeave={handleHideDescription}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                    </span>

                    <span
                      className="delete-icon"
                      onClick={() => handleDeleteDepartment(dept._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                      </svg>

                    </span>
                  </div>
                </td >
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
