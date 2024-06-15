// import React, { useState } from "react";

// const EditEmployee = ({ employee, onClose, onSave }) => {
//   const [fname, setFname] = useState(employee.fname);
//   const [lname, setLname] = useState(employee.lname);
//   const [email, setEmail] = useState(employee.email);
//   const [salary, setSalary] = useState(employee.salary);
//   const [month, setMonth] = useState(employee.month);
//   const [year, setYear] = useState(employee.year);

//   const handleFnameChange = (e) => {
//     setFname(e.target.value);
//   };

//   const handleLnameChange = (e) => {
//     setLname(e.target.value);
//   };

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handleSalaryChange = (e) => {
//     setSalary(e.target.value);
//   };

//   const handleMonthChange = (e) => {
//     setMonth(e.target.value);
//   };

//   const handleYearChange = (e) => {
//     setYear(e.target.value);
//   };

//   const handleSave = () => {
//     const updatedEmployee = { ...employee, fname, lname, email, salary, month, year };
//     onSave(updatedEmployee);
//     onClose();
//   };

//   const popupOverlayStyle = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center"
//   };

//   const popupStyle = {
//     position: "relative",
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     maxWidth: "400px",
//     width: "100%"
//   };

//   const closeButtonStyle = {
//     position: "absolute",
//     top: "10px",
//     right: "10px",
//     cursor: "pointer"
//   };

//   const inputStyle = {
//     width: "100%",
//     padding: "8px",
//     margin: "5px 0",
//     borderRadius: "5px",
//     border: "1px solid #ccc"
//   };

//   const buttonStyle = {
//     padding: "10px 15px",
//     margin: "5px",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer"
//   };

//   return (
//     <div style={popupOverlayStyle} onClick={onClose}>
//       <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
//         <div style={closeButtonStyle} onClick={onClose}>
//           &#x2715;
//         </div>
//         <h3>Edit Employee</h3>
//         <label>First Name</label>
//         <input
//           type="text"
//           value={fname}
//           onChange={handleFnameChange}
//           style={inputStyle}
//         />
//         <label>Last Name</label>
//         <input
//           type="text"
//           value={lname}
//           onChange={handleLnameChange}
//           style={inputStyle}
//         />
//         <label>Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={handleEmailChange}
//           style={inputStyle}
//         />
//         <label>Salary</label>
//         <input
//           type="number"
//           value={salary}
//           onChange={handleSalaryChange}
//           style={inputStyle}
//         />
//         <label>Month</label>
//         <input
//           type="text"
//           value={month}
//           onChange={handleMonthChange}
//           style={inputStyle}
//         />
//         <label>Year</label>
//         <input
//           type="number"
//           value={year}
//           onChange={handleYearChange}
//           style={inputStyle}
//         />
//         <button onClick={handleSave} style={{ ...buttonStyle, backgroundColor: "#4CAF50", color: "white" }}>
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditEmployee;
