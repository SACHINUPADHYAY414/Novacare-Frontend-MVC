import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register.jsx";
import ValidateOtp from "./Pages/ValidateOtp/ValidateOtp.jsx";
import DoctorSlot from "./Pages/DoctorSlot/DoctorSlot.jsx";
import Appointments from "./Pages/Appoitntments/Appointments.jsx";
import ContactUs from "./Pages/ContactUs/ContactUs.jsx";
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";
import ProtectedRoute from "./ProtectRoute.jsx/ProtectRoute";
import ResetPassword from "./Pages/ResetPassword/ResetPassword.jsx";
import Blog from "./Pages/Blogs/Blogs.jsx";
import FindDoctor from "./Pages/FindDoctor/FindDoctor.jsx";

// Admin
import Dashboard from "./Admin/Layout/Dashboard.jsx";
import HomeDashboard from "./Admin/Pages/HomeDashboard/HomeDashboard.jsx";
import Users from "./Admin/Pages/Users/Users.jsx";
import Doctors from "./Admin/Pages/Doctors/Doctors.jsx";
import AddUser from "./Admin/Pages/Users/AddUser.jsx";
import Specialt from "./Admin/Pages/Specialty/Specialty";
import AddDoctor from "./Admin/Pages/Doctors/AddDoctor.jsx";
import EditDoctor from "./Admin/Pages/Doctors/EditDoctor.jsx";
import DutyRoster from "./Admin/Pages/DutyRoster/DutyRoster.jsx";
import AddDutyRoster from "./Admin/Pages/DutyRoster/AddDutyRoster.jsx";
import UsersEnquary from "./Admin/Pages/UsersEnquary/UsersEnquary.jsx";
import AllAppointments from "./Admin/Pages/Appointments/Appointments.jsx";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleCopy = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, [pathname]);

  return (
    <div style={{ userSelect: "none" }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="validate-otp" element={<ValidateOtp />} />
          <Route path="doctor-slot" element={<DoctorSlot />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="forgot-password" element={<ResetPassword />} />
          <Route path="blog" element={<Blog />} />
          <Route path="find-doctors" element={<FindDoctor />} />
          <Route path="about-us" element={<AboutUs />} />
          
          <Route
            path="appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="specialty" element={<Specialt />} />
          <Route path="add-doctor" element={<AddDoctor />} />
          <Route path="edit-doctor" element={<EditDoctor />} />
          <Route path="dutyRoster" element={<DutyRoster />} />
          <Route path="add-duty-roster" element={<AddDutyRoster />} />
          <Route path="enquary" element={<UsersEnquary />} />
          <Route path="appointments-list" element={<AllAppointments />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
