import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../Context/UserContext";
import "./Login.css";
import logoWhite from "./logo-white.png";
import { FiArrowLeft } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [animateLogin, setAnimateLogin] = useState(true);
  const [loading, setLoading] = useState(false); // State to track loading
  const { setUserRole } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user role in localStorage and navigate accordingly
    const storedRole = localStorage.getItem("userRole");
    if (storedRole === "admin") {
      navigate("/"); // Redirect to admin dashboard
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
  
    setTimeout(async () => {
      try {
        const response = await axios.post("http://localhost:5000/login", {
          email,
          password,
        });
  
        const { user } = response.data;
        console.log('Login response:', user); // Verify employeeId is included
  
        setUserRole(user.role);
        localStorage.setItem("userRole", user.role); 
  
        // Store the employee ID in local storage
        localStorage.setItem("employeeId", user.employeeId);
  
        if (user.role === "admin") {
          navigate("/dashboard3");
        } else {
          navigate("/dashboard2");
        }
      } catch (err) {
        console.error(err);
        alert("Invalid email or password");
      } finally {
        setLoading(false);
      }
    }, 500);
  };
  
  

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleForgotPasswordSubmit = (e) => {
   
    e.preventDefault();
    axios
      .post("http://localhost:5000/forgot-password", { email })
      .then((res) => {
        alert("Your password has been sent to your email");
        setShowForgotPassword(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to process forgot password request or the Email input is empty");
      });
  };

  const handleBackButtonClick = () => {
    setAnimateLogin(false); // Disable animation
    setTimeout(() => {
      setShowForgotPassword(false); // Hide forgot password section
      setTimeout(() => {
        setAnimateLogin(true); // Enable animation after a short delay
      }, 100); // Delay to ensure animation reset
    }, 0); // No delay for hiding forgot password section
  };

  return (
    <div className="main-container">
      <div className="left-section">
        <div className="logo-container">
          <img src={logoWhite} alt="Logo" width="100px" />
        </div>
        <div className="LS-content">
          <h1>Welcome to</h1>
          <h2>Payroll Management System</h2>
          <p>
            Our system is designed to automate and streamline the processes involved 
            in paying employees and managing related financial records, enabling to handle 
            complex payroll functions accurately and efficiently.
            Our system helps businesses in managing employee records, calculating taxes, and generating 
            reports efficiently, making it ideal for businesses of all sizes.
          </p>
          <p className="p1">Log in now for a hassle-free payroll experience.</p>
        </div>
      </div>
      <div className="right-section">
        <FiArrowLeft
          className={`back-icon ${showForgotPassword ? "visible" : "hidden"}`}
          onClick={handleBackButtonClick}
        />
        <hr />
        <div
          className={`RS-content ${showForgotPassword ? "hidden" : "visible"}`}
          style={{ animationDelay: animateLogin ? "1s" : "0s" }}
        >
          {loading ? (
            <div className="spinner"></div> // Show spinner when loading
          ) : (
            <>
              <h2>Login</h2>
              <p>Use the specific email and password provided by the company</p>
              <form className="login-form" onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                  className="inputBox"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                  className="inputBox"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <a className="forgot-password" onClick={handleForgotPasswordClick}>
                  Forgot Password?
                </a>
                <button type="submit" className="login-button">
                  Login
                </button>
              </form>
              <p>If you do not have an account, please contact the HR Department</p>
            </>
          )}
        </div>
      </div>
      <div className={`forgot-section ${showForgotPassword ? "visible" : ""}`}>
        <h1>Recover Your Password</h1>
        <form className="forgot-form" onSubmit={handleForgotPasswordSubmit}>
          <label>Email</label>
          <input
            className="forgot-inputBox"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
        <p>Your password will be sent to your email</p>
      </div>
    </div>
  );
};

export default Login;

























// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import UserContext from "../Context/UserContext";
// import "./Login.css";
// import logoWhite from "./logo-white.png";
// import { FiArrowLeft } from "react-icons/fi";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [animateLogin, setAnimateLogin] = useState(true);
//   const [loading, setLoading] = useState(false); // State to track loading
//   const { setUserRole } = useContext(UserContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check for user role in localStorage and navigate accordingly
//     const storedRole = localStorage.getItem("userRole");
//     if (storedRole === "admin") {
//       navigate("/"); // Redirect to admin dashboard
//     }
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Start loading
//     setLoading(true);

//     // Ensure the spinner is visible for at least 2.5 seconds
//     setTimeout(async () => {
//       try {
//         const response = await axios.post("http://localhost:5000/login", {
//           email,
//           password,
//         });

//         const { user } = response.data;
//         setUserRole(user.role);
//         localStorage.setItem("userRole", user.role); // Store the user role in localStorage

//         if (user.role === "admin") {
//           navigate("/dashboard"); // Navigate to admin dashboard
//         } else {
//           navigate("/dashboard"); // Navigate to employee dashboard
//         }
//       } catch (err) {
//         console.error(err);
//         alert("Invalid email or password");
//       } finally {
//         // End loading
//         setLoading(false);
//       }
//     }, 500); // 2.5 seconds delay
//   };

//   const handleForgotPasswordClick = (e) => {
//     e.preventDefault();
//     setShowForgotPassword(true);
//   };

//   const handleForgotPasswordSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .post("http://localhost:5000/forgot-password", { email })
//       .then((res) => {
//         alert("Your password has been sent to your email");
//         setShowForgotPassword(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Failed to process forgot password request");
//       });
//   };

//   const handleBackButtonClick = () => {
//     setAnimateLogin(false); // Disable animation
//     setTimeout(() => {
//       setShowForgotPassword(false); // Hide forgot password section
//       setTimeout(() => {
//         setAnimateLogin(true); // Enable animation after a short delay
//       }, 100); // Delay to ensure animation reset
//     }, 0); // No delay for hiding forgot password section
//   };

//   return (
//     <div className="main-container">
//       <div className="left-section">
//         <div className="logo-container"> <img src={logoWhite} alt="Logo" width="100px" /> </div>
//         <div className="LS-content">
//           <h1>Welcome to</h1>
//           <h2>Payroll Management System</h2>
//           <p>
//             Our system is designed to automate and streamline the processes involved 
//             in paying employees and managing related financial records, enabling to handle 
//             complex payroll functions accurately and efficiently.

//             Our system helps buisnesses in managing employee records, calculating taxes, and generating 
//             reports efficiently, making it ideal for businesses of all sizes.


//           </p>
//           <p className="p1">Log in now for a hassle-free payroll experience.</p>
//         </div>
//       </div>
//       <div className="right-section">
//         <FiArrowLeft
//           className={`back-icon ${showForgotPassword ? "visible" : "hidden"}`}
//           onClick={handleBackButtonClick}
//         />
//         <hr />
//         <div
//           className={`RS-content ${showForgotPassword ? "hidden" : "visible"}`}
//           style={{ animationDelay: animateLogin ? "1s" : "0s" }}
//         >
//           {loading ? (
//             <div className="spinner"></div> // Show spinner when loading
//           ) : (
//             <>
//               <h2>Login</h2>
//               <p>Use the specific email and password provided by the company</p>
//               <form className="login-form" onSubmit={handleSubmit}>
//                 <label>Email</label>
//                 <input
//                   className="inputBox"
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <label>Password</label>
//                 <input
//                   className="inputBox"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <a className="forgot-password" onClick={handleForgotPasswordClick}>
//                   Forgot Password?
//                 </a>
//                 <button type="submit" className="login-button">
//                   Login
//                 </button>
//               </form>
//               <p>If you do not have an account, please contact the HR Department</p>
//             </>
//           )}
//         </div>
//       </div>
//       <div className={`forgot-section ${showForgotPassword ? "visible" : ""}`}>
//         <h1>Recover Your Password</h1>
//         <form className="forgot-form" onSubmit={handleForgotPasswordSubmit}>
//           <label>Email</label>
//           <input
//             className="forgot-inputBox"
//             type="text"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <button type="submit" className="send-button">
//             Send
//           </button>
//         </form>
//         <p>Your password will be sent to your email</p>
//       </div>
//     </div>
//   );
// };

// export default Login;
