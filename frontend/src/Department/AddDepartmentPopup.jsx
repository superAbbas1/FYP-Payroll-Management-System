import React, { useState } from "react";
import "./AddDepartmentPopup.css";
import axios from 'axios';

const AddDepartmentPopup = ({ onClose, onSave }) => {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [designationInput, setDesignationInput] = useState("");
  const [designations, setDesignations] = useState([]);

  const handleAddDesignation = () => {
    if (designationInput.trim() !== "") {
      setDesignations([...designations, designationInput]);
      setDesignationInput("");
    }
  };

  const handleRemoveDesignation = (index) => {
    const updatedDesignations = [...designations];
    updatedDesignations.splice(index, 1);
    setDesignations(updatedDesignations);
  };

  const handleSave = async () => {
    try {
      const newDepartment = {
        name: departmentName,
        description,
        designations
      };

      // Adjust the endpoint URL to match your backend server
      const response = await axios.post('http://localhost:5000/api/departments', newDepartment);

      // Pass the new department data to the parent component
      onSave(response.data);

      // Close the popup
      onClose();
    } catch (error) {
      console.error('Failed to save department:', error);
      alert('Failed to save department. Please try again.');
    }
  };

  return (
    <div className="new-department-container popup-container">
      <div className="popup">
        <h2>Add New Department</h2>
        <label>Department Name:</label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <label>Designations:</label>
        <div className="designation-input-container">
          <input
            type="text"
            value={designationInput}
            onChange={(e) => setDesignationInput(e.target.value)}
          />
          <button onClick={handleAddDesignation}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>

          </button>
        </div>
        <ul className="designation-list">
          {designations.slice().reverse().map((designation, index) => (
            <li key={index}>
              {designation}
              <button onClick={() => handleRemoveDesignation(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>

              </button>
            </li>
          ))}
        </ul>
        <div className="popup-actions">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>


          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentPopup;