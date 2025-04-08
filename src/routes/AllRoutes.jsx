import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  Dashboard,
  EmployeeLeavesPage,
  EmployeeReportPage,
  Employess,
  Login,
  PublicHolidaysPage,
  RegisterEmployee,
} from "../pages";
import { MyPDFDocument } from "../components/pdfDownloads/MyPDFDocument ";

export const AllRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verify = () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("@token");
      const designation = localStorage.getItem("@designation");
      if (token && designation === "Director HR") {
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        setIsAuthenticated(false);
        navigate("/");
      }

      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    verify();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/public-holidays" element={<PublicHolidaysPage />} />
      <Route path="/report" element={<EmployeeReportPage />} />
      <Route path="/register" element={<RegisterEmployee />} />
      <Route path="/employees" element={<Employess />} />
      <Route path="/employees/edit/:id" element={<RegisterEmployee />} />
      <Route path="/employee-leaves" element={<EmployeeLeavesPage />} />
      <Route path="/employee-report" element={<MyPDFDocument />} />
    </Routes>
  );
};
