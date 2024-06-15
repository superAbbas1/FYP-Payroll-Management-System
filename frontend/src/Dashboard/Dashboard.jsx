// // Dashboard.js
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from '../Sidebar/Sidebar';
// import Header from '../Header/Header';
// import "./Dashboard.css";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <Header />
//       <div className="dashboard-content">
//         <div className="sidebar">
//           <Sidebar />
//         </div>
//         <div className="main-content">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
// Dashboard.js
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from '../Sidebar/Sidebar';
// import Header from '../Header/Header';
// import "./Dashboard.css";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <Header />
//       <div className="dashboard-content">
//         <div className="sidebar">
//           <Sidebar />
//         </div>
//         <div className="main-content">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;





import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import "./Dashboard.css";


const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
