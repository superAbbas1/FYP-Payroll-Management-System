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
    <div className="popup-container">
      <div className="popup">
        <h2>Add Designation to {department.name}</h2>
        <label>Designation:</label>
        <input
          type="text"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
        <div className="popup-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddDesignationPopup;