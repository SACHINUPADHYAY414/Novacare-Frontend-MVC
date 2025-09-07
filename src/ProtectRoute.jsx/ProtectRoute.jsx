import React ,{ useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/authSlice";
import { persistor } from "../Redux/store";
import { setToken } from "../Components/Action/Api";
import { useToastr } from "../Components/Toastr/ToastrProvider";
import { OPPS_MSG, SESSION_EXPIRE, EXPIRATION_TIME } from "../Utils/strings";

const ProtectedRoute = ({ children, role }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { customToast } = useToastr();
  const location = useLocation();

  // Track session state
  const [isValid, setIsValid] = React.useState(true);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Check every 10 seconds (or 1 min)
    const interval = setInterval(() => {
      const loginTime = Number(localStorage.getItem("loginTime") || 0);
      const tokenExpiresIn =
        Number(localStorage.getItem("tokenExpiresIn")) || EXPIRATION_TIME;
      const now = Date.now();

      if (loginTime + tokenExpiresIn <= now) {
        // Token expired → logout & redirect
        dispatch(logout());
        persistor.purge();
        setToken("");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("tokenExpiresIn");

        customToast({
          severity: "error",
          summary: OPPS_MSG,
          detail: SESSION_EXPIRE,
          life: 3000,
          sticky: false,
        });

        setIsValid(false);
      }
    }, 10000); // every 10 seconds, you can increase to 60*1000 for 1 minute

    return () => clearInterval(interval);
  }, [token, dispatch, customToast]);

  // No token → redirect immediately
  if (!token || !isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
