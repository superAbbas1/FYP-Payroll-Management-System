import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Registration.css";

const Registration = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [city, setCity] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [cnic, setCnic] = useState('');
  const [joining, setJoining] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get("http://localhost:5000/api/departments")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });
  }, []);


  useEffect(() => {
    if (department) {
      axios.get(`http://localhost:5000/api/departments/${department}/designations`)
        .then(response => {
          setDesignations(response.data);
        })
        .catch(error => {
          console.error("Error fetching designations:", error);
        });
    } else {
      setDesignations([]);
    }
  }, [department]);

  const handleDepartmentChange = (e) => {
    const selectedDeptId = e.target.value;
    setDepartment(selectedDeptId);
    const selectedDept = departments.find(dept => dept._id === selectedDeptId);
    setSelectedDepartmentName(selectedDept ? selectedDept.name : ""); // Set department name
  };

  const handlePhoneNumChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setPhoneNum(value);
    }
  };

  const handleAlphabetInput = (e, setFunction) => {
    const value = e.target.value;
    if (/^[a-zA-Z]*$/.test(value)) {
      setFunction(value);
    }
  };

  const handleCnicInput = (e, setFunction) => {
    const value = e.target.value;
    if (/^\d{0,13}$/.test(value)) {
      setFunction(value);
    }
  };

  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta',
    'Faisalabad', 'Multan', 'Rawalpindi', 'Hyderabad', 'Sialkot',
    'Sargodha', 'Sukkur', 'Bahawalpur', 'Gujranwala', 'Mardan',
    'Murree', 'Nawabshah', 'Dera Ismail Khan', 'Dera Ghazi Khan', 'Swat',
    'Abbottabad', 'Mansehra', 'Peshawar', 'Pakpattan', 'Pindi Bhattian',
  ];

  const statusTypes = [
    'Active', 'On Leave', 'Probationary', 'Part-Time', 'Full-Time',
    'Contractor', 'Intern', 'Retired', 'Terminated', 'Resigned',
    'Laid Off', 'Suspended'
  ];

  const handleSubmit = (e) => {
    console.log('password in frontend: ', password);
    e.preventDefault();

    if (!fname || !lname || !email || !cnic || !department || !designation || !city || !phoneNum || !password || !joining || !cnic || !address || !salary || !status) {
      alert("Please fill in all required fields.");
      return;
    }

    if (cnic.length !== 13) {
      alert("Invalid CNIC. It must be of 13 digits");
      return;
    }

    if (phoneNum.length !== 11) {
      alert("Invalid Phone Number");
      return;
    }

    axios
      .post("http://localhost:5000/register", {
        fname,
        lname,
        department,
        designation,
        city,
        bankName,
        accountName,
        accountNum,
        phoneNum,
        email,
        password,
        joining,
        cnic,
        address,
        salary,
        status,
      })
      .then((res) => {
        alert(`User created successfully. Employee ID: ${res.data.employeeID}`);
        // Optionally, reset form fields after successful registration
        setFname("");
        setLname("");
        setDepartment("");
        setDesignation("");
        setCity("");
        setPhoneNum("");
        setBankName("");
        setAccountName("");
        setAccountNum("");
        setCnic("");
        setJoining("");
        setEmail("");
        setPassword("");
        setAddress("");
        setSalary("");
        setStatus("");
      })
      .catch((err) => {
        console.error("Error registering user:", err);
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert("Failed to register user. Please try again.");
        }
      });
  };

  return (
    <div className="registration-container">
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <h3>Personal Information</h3>
        <div className="form-row">
          <div className="inputBox">
            <input
              type="text"
              value={fname}
              onChange={(e) => handleAlphabetInput(e, setFname)}
              placeholder="Enter First Name"
            />
          </div>


          <div className="inputBox">
            <input
              type="text"
              value={lname}
              onChange={(e) => handleAlphabetInput(e, setLname)}
              placeholder="Enter Last Name"
            />
          </div>

          <div className="inputBox">
            <input
              type="text"
              value={cnic}
              onChange={(e) => handleCnicInput(e, setCnic)}
              placeholder="Enter CNIC"
            />

            <p className={`validation-text ${cnic.length === 13 ? "hidden" : "visible"}`}
            >
              CNIC must be exactly 13 digits
            </p>
          </div>
        </div>



        <h3>Contact Information</h3>

        <div className="form-row">
          <div className="inputBox">
            <input
              type="text"
              value={phoneNum}
              onChange={handlePhoneNumChange}
              placeholder="Enter Phone Number"
            />

            <p
             className={`validation-text ${phoneNum.length === 11 ? "hidden" : "visible"}`}
            >
              Phone Number must be exactly 11 digits
            </p>
          </div>

          <div className="inputBox">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Select City"
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>


          <div className="inputBox">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Address"
            />
          </div>
        </div>

        <h3>In-Company Details & Joining Date</h3>

        <div className="form-row-company">
          <div>
            <select
              value={department}
              onChange={handleDepartmentChange}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              disabled={!department}
            >
              <option value="">Select Designation</option>
              {designations.map(desig => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              {statusTypes.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>


          <div>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter salary"
            />
          </div>

          <div>
            <input
              type="date"
              value={joining}
              onChange={(e) => setJoining(e.target.value)}
              placeholder="Enter Joining Date"
            />
          </div>

        </div>

        <h3>Bank Account Information</h3>
        <div className="form-row">
          <div className="inputBox">
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter Bank Name"
            />
          </div>

          <div className="inputBox">
            <input
              type="text"
              value={accountName}
              onChange={(e) => handleAlphabetInput(e, setAccountName)}
              placeholder="Enter Account Name"
            />
          </div>

          <div className="inputBox">
            <input
              type="text"
              value={accountNum}
              onChange={(e) => setAccountNum(e.target.value)}
              placeholder="Enter Account Number"
            />
          </div>
        </div>

        <h3>Credentials</h3>

        <div className="form-row">
          <div className="inputBox">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
          </div>

          <div className="inputBox">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default Registration;