import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../Components/Action/Api";
import { useToastr } from "../../Components/Toastr/ToastrProvider";
import { useNavigate } from "react-router-dom";
import { otpVerifySuccess } from "../../Redux/authSlice";
import {
  ENTER_CORRECT_OTP,
  ERROR,
  EXPIRATION_TIME,
  INVALID_OTP,
  OPPS_ERROR,
  OPPS_MSG,
  OTP_VERIFY_SUCCESS,
  RESEND_OTP,
  SUCCESS,
  SUCCESS_MSG,
  WARNING
} from "../../Utils/strings";
import images from "../../Utils/ImagesData";

const ValidateOtp = () => {
  const navigate = useNavigate();
  const { customToast } = useToastr();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { user, from } = useSelector((state) => state.auth);
  const email = user?.email;
  const otp = user?.otp;
  const [otpDigits, setOtpDigits] = useState(
    otp ? otp.split("") : new Array(6).fill("")
  );

  const handleChange = (e, index) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otpDigits.join("");

    if (otpValue.length < 6) {
      customToast({
        severity: WARNING,
        summary: OPPS_MSG,
        detail: ENTER_CORRECT_OTP,
        life: 3000
      });
      return;
    }

    try {
      setLoading(true);

      // Determine endpoint based on origin
      const endpoint =
        from === "register"
          ? "/api/auth/otp-verify"
          : "/api/auth/login/otp-verify";

      const response = await api.post(endpoint, {
        email,
        otp: otpValue
      });

      const returnedUser = response.data?.user;
      const token = response.data?.token;

      if (!returnedUser) {
        customToast({
          severity: ERROR,
          summary: OPPS_MSG,
          detail: INVALID_OTP,
          life: 3000
        });
        return;
      }

      const userRole = returnedUser?.role || returnedUser?.type;

      // Show success toast
      customToast({
        severity: SUCCESS,
        summary: SUCCESS_MSG,
        detail: response.data?.message || OTP_VERIFY_SUCCESS,
        life: 3000
      });

      // Dispatch user + token to Redux
      if (token) {
        dispatch(
          otpVerifySuccess({
            token,
            user: returnedUser
          })
        );
        localStorage.setItem("loginTime", Date.now().toString());
        localStorage.setItem("tokenExpiresIn", EXPIRATION_TIME.toString());
      }

      // Navigate based on role
      if (userRole === "ADMIN") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: error.response?.data?.message || INVALID_OTP,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setOtpDigits(new Array(6).fill(""));
      const endpoint = "/api/auth/resend-otp";
      const response = await api.post(endpoint, { email });

      customToast({
        severity: SUCCESS,
        summary: RESEND_OTP,
        detail: response.data.message,
        life: 3000
      });

      if (response.data.otp) {
        setOtpDigits(response.data.otp.split(""));
      }
      setTimeout(() => {
        const firstInput = document.getElementById("otp-0");
        if (firstInput) firstInput.focus();
      }, 100);
    } catch (error) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: error.response?.data?.message || OPPS_ERROR,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 text-black text-start"
      style={{
        backgroundImage: `url(${images.background3})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        minHeight: "calc(100vh - 145px)",
        zIndex: 2
      }}
    >
      <div
        className="card shadow p-4 "
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <div className="otp-verify-icon">
            <img src={images.icon2mfa} alt="User Icon" />
          </div>
          <h4 className="fw-bold">Validate OTP</h4>
          <sm className="text-muted">
            {email
              ? `We've sent an OTP to ${email}`
              : "Enter the OTP sent to your email"}
          </sm>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between mb-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="tel"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="form-control text-center me-2"
                style={{ width: "40px", height: "40px", fontSize: "48px" }}
              />
            ))}
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Sending..." : "Verify OTP"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Didn’t receive the code?{" "}
            <span
              className="fw-semibold text-primary"
              onClick={handleResendOtp}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              Resend
            </span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default ValidateOtp;
