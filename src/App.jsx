import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register.jsx";
import ProtectedRoute from "./ProtectRoute.jsx/ProtectRoute";
import { logout } from "./Redux/authSlice.js";
import { setToken, setToastHandler } from "./Components/Action/Api";
import { useToastr } from "./Components/Toastr/ToastrProvider";
import { OPPS_MSG, SESSION_EXPIRE, EXPIRATION_TIME } from "./Utils/strings.js";
import ValidateOtp from "./Pages/validateOtp/validateOtp.jsx";
import { persistor } from "./Redux/store";
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";
import DoctorSlot from "./Pages/DoctorSlot/DoctorSlot.jsx";
import Appointments from "./Pages/Appoitntments/Appointments.jsx";
import ContactUs from "./Pages/ContactUs/ContactUs.jsx";

const App = () => {
  const { customToast } = useToastr();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token) || "";

  // Loading indicator on route change
  useEffect(() => {
    window.loadingStart?.();
    window.scrollTo(0, 0);
    const timer = setTimeout(() => window.loadingEnd?.(), 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Set API token on token change
  useEffect(() => {
    setToken(token);
  }, [token]);

  // Save login time and expiration on login
  useEffect(() => {
    if (token) {
      const now = Date.now();
      localStorage.setItem("loginTime", now.toString());
      localStorage.setItem("tokenExpiresIn", EXPIRATION_TIME.toString());
    } else {
      localStorage.removeItem("loginTime");
      localStorage.removeItem("tokenExpiresIn");
    }
  }, [token]);

  // Check token expiry on route change
  useEffect(() => {
    if (!token) return;

    const loginTime = localStorage.getItem("loginTime");
    const tokenExpiresIn = localStorage.getItem("tokenExpiresIn");

    if (loginTime && tokenExpiresIn) {
      const now = Date.now();
      const expiresAt = parseInt(loginTime, 10) + parseInt(tokenExpiresIn, 10);

      if (now >= expiresAt) {
        handleTokenExpiry();
      }
    }
  }, [token, pathname]);

  // Set interval to check token expiry every minute
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      const tokenExpiresIn = localStorage.getItem("tokenExpiresIn");

      if (loginTime && tokenExpiresIn) {
        const now = Date.now();
        const expiresAt =
          parseInt(loginTime, 10) + parseInt(tokenExpiresIn, 10);

        if (now >= expiresAt) {
          clearInterval(interval);
          handleTokenExpiry();
        }
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  const handleTokenExpiry = async () => {
    dispatch(logout());
    await persistor.purge();
    setToken("");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("tokenExpiresIn");

    customToast({
      severity: "error",
      summary: OPPS_MSG,
      detail: SESSION_EXPIRE,
      life: 3000,
      sticky: false,
      closable: true
    });

    navigate("/login");
  };

  // Setup toast handler for API calls
  useEffect(() => {
    setToastHandler(customToast);
  }, [customToast]);

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
          path="payment"
          element={
            <ProtectedRoute>
              <DoctorSlot />
            </ProtectedRoute>
          }
        />

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
    </Routes>
  );
};

export default App;
