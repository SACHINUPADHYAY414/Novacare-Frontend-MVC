import { useState, useEffect } from "react";
import CustomInputField from "../../Components/CustomInput/CustomInputField.jsx";
import {
  ERROR_REQUIRED,
  ERROR_VALIDATE_EMAIL,
  ERROR_LEADING_OR_TRAILING_SPACE,
  ERROR_DOUBLE_SPACE,
  OPPS_MSG,
  SUCCESS_MSG,
  SERVER_ERROR
} from "../../Utils/strings.js";
import { useToastr } from "../../Components/Toastr/ToastrProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import images from "../../Utils/ImagesData.js";

const API_BASE = "http://localhost:8080/api/auth";

const ResetPassword = () => {
  const { customToast } = useToastr();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: password
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(new Array(6).fill(""));
  const [verifiedOtp, setVerifiedOtp] = useState(""); // Save verified OTP
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation
  const validateEmail = (email) => {
    if (!email) return ERROR_REQUIRED;
    const trimmed = email.trim();
    if (trimmed !== email) return ERROR_LEADING_OR_TRAILING_SPACE;
    if (/\s{2,}/.test(email)) return ERROR_DOUBLE_SPACE;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return ERROR_VALIDATE_EMAIL;
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return ERROR_REQUIRED;
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Handle OTP change
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otpDigits];
    newOtp[index] = value ? value[0] : "";
    setOtpDigits(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtp = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/reset-password/request`, {
        email
      });

      customToast({
        severity: "success",
        summary: "OTP Sent",
        detail: res.data.message || SUCCESS_MSG,
        life: 3000
      });

      setStep(2);
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || SERVER_ERROR;
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: msg,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    const emailError = validateEmail(email);

    if (emailError || otp.length !== 6) {
      setErrors({ email: emailError, otp: "OTP must be 6 digits" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/reset-password/verify-otp`, {
        email,
        otp
      });

      customToast({
        severity: "success",
        summary: "OTP Verified",
        detail: res.data.message || SUCCESS_MSG,
        life: 3000
      });

      setVerifiedOtp(otp); // Store verified OTP
      setStep(3);
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || SERVER_ERROR;
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: msg,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(newPassword);

    if (emailError || passwordError) {
      setErrors({ email: emailError, newPassword: passwordError });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/reset-password/confirm`, {
        email,
        otp: verifiedOtp,
        newPassword
      });

      customToast({
        severity: "success",
        summary: "Password Reset",
        detail: res.data.message || SUCCESS_MSG,
        life: 3000
      });

      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || SERVER_ERROR;
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: msg,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setErrors({});
  }, [step]);

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 text-black text-start"
      style={{
        minHeight: "calc(100vh - 145px)",
        backgroundImage: `url(${images.resetPasswordBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", pointerEvents: "none" }}
      ></div>

      <div
        className="container d-flex justify-content-center align-items-center"
        // style={{ maxHeight: "80vh" }}
      >
        <div
          className="card shadow p-4"
          // style={{ maxWidth: "400px", width: "100%" }}
           style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(3px)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            zIndex: 2,
            color: "white",
            maxWidth: "400px", width: "100%"
          }}
        >
          <div className="text-center">
           <div className="otp-verify-icon">
              <img src={images.icon2mfa} alt="User Icon" />
            </div>

            <h4 className="fw-bold">
              {step === 1 && "Send OTP"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Password"}
            </h4>

            <small className="text-muted">
              {step === 1 && "Enter your registered email to receive OTP"}
              {step === 2 && `OTP sent to ${email}`}
              {step === 3 && "Enter your new password"}
            </small>
          </div>

          <CustomInputField
            type="email"
            field={{ label: "Email", name: "email" }}
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={step !== 1}
          />

          {step === 2 && (
            <div className="mt-2">
              <label className="form-label">Otp</label>
              <div className="d-flex justify-content-center gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="tel"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    className="form-control text-center"
                    style={{ width: "40px", fontSize: "34px" }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <CustomInputField
              type="password"
              field={{ label: "New Password", name: "newPassword" }}
              value={newPassword}
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
            />
          )}

          {/* Button */}
          <div className="d-grid mt-3">
            {step === 1 && (
              <button
                onClick={handleSendOtp}
                className="btn btn-primary fw-semibold"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            )}
            {step === 2 && (
              <button
                onClick={handleVerifyOtp}
                className="btn btn-primary fw-semibold"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleResetPassword}
                className="btn btn-primary fw-semibold"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            )}
          </div>

          <p className="text-center mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
            <span
              onClick={() => navigate("/login")}
              className="text-white fw-normal"
              style={{ cursor: "pointer" }}
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
