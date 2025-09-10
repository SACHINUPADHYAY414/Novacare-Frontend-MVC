import React, { useState } from "react";
import CustomInputField from "../../Components/CustomInput/CustomInputField.jsx";
import {
  ERROR_REQUIRED,
  ERROR_VALIDATE_EMAIL,
  ERROR_LEADING_OR_TRAILING_SPACE,
  ERROR_DOUBLE_SPACE,
  OPPS_MSG,
  SUCCESS_MSG,
  SERVER_ERROR,
  SUCCESS,
  FALSE,
  TRUE
} from "../../Utils/strings.js";
import { FaUser } from "react-icons/fa";
import {
  sanitizeEmail,
  verifyEmail,
  sanitizePassword,
  verifyDoubleSpace,
  verifyStartingOrEndingCharacters,
  start_with_char_or_number,
  sanitizeInput
} from "../../Utils/allValidation.js";
import api from "../../Components/Action/Api.js";
import { useToastr } from "../../Components/Toastr/ToastrProvider.jsx";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../Redux/authSlice.js";
import { useDispatch } from "react-redux";
import images from "../../Utils/ImagesData.js";

const Login = () => {
  const { customToast } = useToastr();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/validate-otp";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const fields = [
    {
      id: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
      required: TRUE
    },
    {
      id: "password",
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      required: TRUE
    }
  ];

  const handleChange = (e, label, pastedValue = "") => {
    const { name, value } = e.target;
    const fieldMeta = fields.find((f) => f.name === name);
    const required = fieldMeta?.required || FALSE;

    // Combine current input value and pasted value (if any)
    const newValue = value + pastedValue;
    const sanitized = sanitizeInput(newValue);
    let updatedValue = "";

    if (name === "email") updatedValue = sanitizeEmail(sanitized);
    else if (name === "password") updatedValue = sanitizePassword(sanitized);
    else updatedValue = sanitized;

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));

    let error = "";
    if (!newValue && required) {
      error = ERROR_REQUIRED(label);
    } else if (start_with_char_or_number.test(newValue)) {
      error = ERROR_LEADING_OR_TRAILING_SPACE;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleOnBlur = (e, label) => {
    const { name, value } = e.target;
    const fieldMeta = fields.find((f) => f.name === name);
    const required = fieldMeta?.required || FALSE;

    let error = "";
    if (!value && required) {
      error = ERROR_REQUIRED(label);
    } else if (!verifyStartingOrEndingCharacters(value)) {
      error = ERROR_LEADING_OR_TRAILING_SPACE;
    } else if (verifyDoubleSpace(value)) {
      error = ERROR_DOUBLE_SPACE;
    }

    if (name === "email" && value && !verifyEmail(value)) {
      error = ERROR_VALIDATE_EMAIL;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const onPaste = (e, label) => {
    e.preventDefault();
    const name = e.target.name;
    const pastedValue = e.clipboardData.getData("Text");

    if (pastedValue.includes("<") || pastedValue.includes(">")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Pasted content contains invalid characters."
      }));
      return;
    }

    const syntheticEvent = {
      target: {
        name,
        value: e.target.value
      }
    };

    handleChange(syntheticEvent, label, pastedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};

    fields.forEach(({ name, label, required }) => {
      const value = formData[name];
      if (required && !value) {
        tempErrors[name] = ERROR_REQUIRED(label);
      }
      if (name === "email" && value && !verifyEmail(value)) {
        tempErrors[name] = ERROR_VALIDATE_EMAIL;
      }
    });

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      window?.loadingStart();
      const response = await api.post("/api/auth/login", formData);

      dispatch(
        loginSuccess({
          from: "login",
          token: null,
          user: response.data,
          otp: response.data.otp
        })
      );
      setLoading(false);
      navigate("/validate-otp", { replace: TRUE });

      const errorMessage = response?.data?.message;
      e.message ||
        customToast({
          severity: SUCCESS,
          summary: SUCCESS_MSG,
          detail: errorMessage,
          life: 3000
        });
    } catch (error) {
      console.error("Login error:", error);
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: error.response?.data?.message || error.message || SERVER_ERROR,
        life: 3000
      });
    } finally {
      setLoading(false);
      window?.loadingEnd();
    }
  };

  const renderInput = (field) => (
    <CustomInputField
      key={field.id}
      type={field.type}
      field={field}
      value={formData[field.name] || ""}
      placeholder={field.placeholder}
      onChange={(e) => handleChange(e, field.label)}
      onBlur={(e) => handleOnBlur(e, field.label)}
      onPaste={(e) => onPaste(e, field.label)}
      error={errors[field.name] || ""}
      labelStyle={{ color: "#fff", fontWeight: "600", fontSize: "1.1rem" }}
    />
  );

  return (
    <div
      className="justify-content-center align-items-center w-100 text-black text-start"
      style={{
        minHeight: "calc(100vh - 145px)",
        zIndex: 2,
        backgroundImage: `url(${images.loginBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          // zIndex: 1,
          pointerEvents: "none"
        }}
      ></div>
      {/* Main Content */}
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ maxHeight: "80vh" }}
      >
        <div
          className="text-center text-white me-5 d-none d-md-block"
          style={{ zIndex: 2, paddingBottom: "100px" }}
        >
          <h1 className="fw-bold">Hospital Portal</h1>
          <p className="lead">
            Access your health data, appointments, and doctors online anytime.
          </p>
        </div>

        <div
          className="login-card"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(3px)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            zIndex: 2,
            color: "white"
          }}
        >
          <div className="text-center">
            <div className="otp-verify-icon">
              <img src={images.compalyLogo} alt="User Icon" />
            </div>
            <h4 className="fw-bold">Login</h4>
          </div>
          <form onSubmit={handleSubmit}>
            {fields.map(renderInput)}

            <div className="text-end mt-1">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-decoration-none fw-semibold"
                style={{
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  color: "#fff"
                }}
              >
                Forgot Password?
              </span>
            </div>

            <div className="d-grid mt-2">
              <button
                type="submit"
                className="btn btn-primary fw-semibold"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <p className="text-center mt-2 mb-0" style={{ fontSize: "0.9rem" }}>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary fw-semibold text-decoration-none"
              style={{ cursor: "pointer" }}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
