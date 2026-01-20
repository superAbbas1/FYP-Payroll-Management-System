// AddDesignationPopup.js

import React, { useState } from "react";
import "./AddDesignationPopup.css"; // Import your CSS file for styling

const AddDesignationPopup = ({ department, onClose, onSave }) => {
  const [designation, setDesignation] = useState("");

  const handleSave = () => {
    if (designation.trim() === "") {
      alert("Designation is required.");
      return;
    }
    onSave(designation);
    onClose();
  };

  return (
    <div className="add-designation-container popup-container">
      <div className="popup">
        <h2>Add Designation to {department.name}</h2>
        <label>Designation:</label>
        <input
          type="text"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
        <div className="popup-buttons">
          <button className="main-button" onClick={handleSave}>Save</button>
          <button className="close-button" onClick={onClose}>
            <svg className="close-button-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDesignationPopup;