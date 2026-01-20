import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Header from './Header/Header';
import Dashboard from './Dashboard/Dashboard';
import Registration from './Registration/Registration';
import Employeelist from "./EmployeeList/Employeelist";
import Dashboard2 from './Dashboard2/Dashboard2';
import EmployeeAttendance from './ViewAttandance/EmployeeAttendance';
import MarkAttendance from './ViewAttandance/MarkAttendance';
import EditAttendance from "./AdminAttandance/EditAttendance";
import ViewAttendance from "./AdminAttandance/ViewAttendance";
import EditSalary from './AdminEditSalary/EditSalary';
import ViewSalary from './AdminViewSalary/ViewSalary';
import ProvidentFunds from './AdminProvidentFunds/ProvidentFunds';
import Loan from './Loan/Loan';
import Department from './Department/Department';
import Profile from './Profile/Profile';
import EmployeeSalary from './EmployeeSalary/EmployeeSalary';
import EmployeePF from './EmployeeProvidentFund/EmployeePF';
import AdminLeaves from './AdminLeaves/AdminLeaves';
import EmployeeLeaves from './EmployeeLeaves/EmployeeLeaves';
import { UserProvider } from './Context/UserContext'; // Import UserProvider
import EmpLoan from './EmpLoan/EmpLoan';
import Dashboard3 from './Dashboard3/Dashboard3';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Employee Dashboard */}
          <Route path="/employee/*" element={<Dashboard2 />}>

            <Route path="mark-attendance" element={<MarkAttendance />} />
            <Route path="attandance" element={<EmployeeAttendance />} />
            <Route path="salary" element={<EmployeeSalary />} />
            <Route path="provident-fund-details" element={<EmployeePF />} />
            <Route path="leaves" element={<EmployeeLeaves />} />
            <Route path="profile" element={<Profile />} />
            <Route path="provident-fund-loan" element={<EmpLoan />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin/*" element={<Dashboard3 />}>
            <Route path="employeelist" element={<Employeelist />} />
            <Route path="edit-salary" element={<EditSalary />} />
            <Route path="view-salary" element={<ViewSalary />} />
            <Route path="view-provident-funds" element={<ProvidentFunds />} />
            <Route path="loan-requests" element={<Loan />} />
            <Route path="leave-requests" element={<AdminLeaves />} />
            <Route path="registration" element={<Registration />} />
            <Route path="attendance/edit" element={<EditAttendance />} />
            <Route path="department" element={<Department />} />
            <Route path="view-attandance" element={<ViewAttendance />} />
          </Route>

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
