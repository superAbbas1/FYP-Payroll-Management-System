// // App.js

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './login/Login';
// import Dashboard from './Dashboard/Dashboard';
// import Registration from './Registration/Registration';
// import Employeelist from "./EmployeeList/Employeelist";
// import Dashboard2 from './Dashboard2/Dashboard2';
// import EmployeeAttendance from './ViewAttandance/EmployeeAttendance';
// import EmployeeSalary from './ViewSalary/EmployeeSalary';


// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard/*" element={<Dashboard />}>
//           {/* Set the default route for the Dashboard component */}
//           <Route index element={<Dashboard2 />} />
//           <Route path="view-attandance-employee" element={<EmployeeAttendance />} />
//           <Route path="view-salary-employee" element={<EmployeeSalary />} /> 
//           <Route path="employeelist" element={<Employeelist />} /> 
//           <Route path="registration" element={<Registration />} /> 
         
         

//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Dashboard from './Dashboard/Dashboard';
import Registration from './Registration/Registration';
import Employeelist from "./EmployeeList/Employeelist";
import Dashboard2 from './Dashboard2/Dashboard2';
import EmployeeAttendance from './ViewAttandance/EmployeeAttendance';
import EmployeeSalary from './ViewSalary/EmployeeSalary';
import EditAttendance from "./AdminAttandance/EditAttendance";
import ViewAttendance from"./AdminAttandance/ViewAttendance";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          {/* Set the default route for the Dashboard component */}
          <Route index element={<Dashboard2 />} />
          <Route path="view-attandance-employee" element={<EmployeeAttendance />} />
          <Route path="view-salary-employee" element={<EmployeeSalary />} /> 
          <Route path="employeelist" element={<Employeelist />} /> 
          <Route path="registration" element={<Registration />} />
          {/* Add nested routes for attendance */}
          <Route path="attendance/edit" element={<EditAttendance/>} />
          <Route path="attendance/view" element={<ViewAttendance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
