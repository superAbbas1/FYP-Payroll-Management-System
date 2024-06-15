


// Registration.jsx

import React, { useState } from "react";
import axios from "axios";
import "./Registration.css";

const Registration = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/register", { fname, lname, email, password })
      .then((res) => {
        alert("User created successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="registration-container">
      <h2>Register new employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="inputBox"
          type="text"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          placeholder="Enter First Name"
        />
        <input
          className="inputBox"
          type="text"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          placeholder="Enter Last Name"
        />
        <input
          className="inputBox"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          className="inputBox"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        <button type="submit" className="submitButton">Register</button>
      </form>
    </div>
  );
};

export default Registration;


