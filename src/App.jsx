import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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

// Admin
import Dashboard from "./Admin/Layout/Dashboard.jsx";
import HomeDashboard from "./Admin/Pages/HomeDashboard/HomeDashboard.jsx";
import Users from "./Admin/Pages/Users/Users.jsx";
import Doctors from "./Admin/Pages/Doctors/Doctors.jsx";
import AddUser from "./Admin/Pages/Users/AddUser.jsx";
import Specialt from './Admin/Pages/Specialty/Specialty';
import AddDoctor from "./Admin/Pages/Doctors/AddDoctor.jsx";
import EditDoctor from "./Admin/Pages/Doctors/EditDoctor.jsx";
import DutyRoster from "./Admin/Pages/DutyRoster/DutyRoster.jsx";
const App = () => {
  const { pathname } = useLocation();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="validate-otp" element={<ValidateOtp />} />
        <Route path="doctor-slot" element={<DoctorSlot />} />
        <Route path="contact-us" element={<ContactUs />} />

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
        <Route path="specialty" element={<Specialt/>}/>
        <Route path="add-doctor" element={<AddDoctor/>}/>
        <Route path="edit-doctor" element={<EditDoctor/>}/>
        <Route path="dutyRoster" element={<DutyRoster/>}/>
      </Route>
    </Routes>
  );
};

export default App;
