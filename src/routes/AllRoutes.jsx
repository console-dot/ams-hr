import { Temp } from "../components/employeeLeaves/Temp";
import {
  Dashboard,
  EmployeeLeavesPage,
  EmployeeReportPage,
  Employess,
  Login,
  RegisterEmployee,
} from "../pages";
import { Route, Routes } from "react-router-dom";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login />} />
      <Route path="/report" element={<EmployeeReportPage />} />
      <Route path="/register" element={<RegisterEmployee />} />
      <Route path="/employees" element={<Employess />} />
      <Route path="/employees/edit/:id" element={<RegisterEmployee />} />
      <Route path="/employee-leaves" element={<EmployeeLeavesPage />} />
      <Route path="/temp" element={<Temp />} />
    </Routes>
  );
};
