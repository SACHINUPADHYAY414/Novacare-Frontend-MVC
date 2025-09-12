import { Link } from "react-router-dom";
import donateImage from "/assets/Icons/donate-icon.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/authSlice";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { useToastr } from "../Toastr/ToastrProvider";
import { COMPANY_NAME, SUCCESS_MSG } from "../../Utils/strings";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dropdown from "react-bootstrap/Dropdown";
import { useRef } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import images from "../../Utils/ImagesData";

const Navbar = () => {
  const dispatch = useDispatch();
  const offcanvasRef = useRef(null);
  const { customToast } = useToastr();
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { uppcomingAppointment } = useSelector((state) => state.appointment);

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };

  const closeOffcanvas = () => {
    if (offcanvasRef.current) {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(
        offcanvasRef.current
      );

      if (offcanvasInstance) {
        offcanvasInstance.hide();

        offcanvasRef.current.addEventListener(
          "hidden.bs.offcanvas",
          () => {
            const backdrop = document.querySelector(".offcanvas-backdrop");
            if (backdrop) {
              backdrop.remove();
            }
            document.body.classList.remove("offcanvas-backdrop", "modal-open");
            document.body.style.overflow = "";

            if (document.activeElement) {
              document.activeElement.blur();
            }
          },
          { once: true }
        );
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    customToast({
      severity: "success",
      summary: SUCCESS_MSG,
      detail: "Logout successful.",
      life: 3000,
      sticky: false,
      closable: true
    });
    navigate("/");
  };

  const handleAppointments = () => {
    navigate("/appointments");
  };

  return (
    <div className="w-100">
      {/* Top Links */}
      <div
        className="border-bottom d-none d-lg-flex fw-semibold"
        style={{ fontSize: "0.85rem" }}
      >
        <div className="container d-none d-lg-flex justify-content-end align-items-center px-2 gap-2">
          <Link to="/find-doctors" className="text-dark text-decoration-none">
            Find a Doctor
          </Link>
          <Link
            to="/pay-bills"
            className="btn btn-primary btn-sm text-white px-2"
            style={{
              height: "25px",
              lineHeight: "22px",
              padding: "0 6px",
              backgroundColor: "#0074bc"
            }}
          >
            Pay Bills
          </Link>
          <Link
            to="/donate"
            className="d-flex align-items-center text-dark text-decoration-none fw-bold"
          >
            <img
              src={donateImage}
              alt="Donate"
              width="18"
              height="18"
              className="me-1"
            />
            DONATE
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="container navbar navbar-expand-lg navbar-light px-2">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={images.compalyLogo} alt="logo" height="40" />
          <span
            style={{
              // display: "none",
              fontWeight: "bold",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              color: "#2372A0"
            }}
          >
            {COMPANY_NAME}
          </span>
        </Link>

        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mainOffcanvas"
          aria-controls="mainOffcanvas"
          style={{
            fontWeight: "bold",
            fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
            color: "#0074bc"
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Mobile offcanvas */}
        <div
          ref={offcanvasRef}
          className="offcanvas offcanvas-end d-lg-none"
          tabIndex="-1"
          id="mainOffcanvas"
          aria-labelledby="mainOffcanvasLabel"
        >
          <div className="offcanvas-header">
            <h5
              className="offcanvas-title text-primary fw-bold"
              id="mainOffcanvasLabel"
            >
              {user ? user.name : "Menu"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body position-relative pb-5">
            {/* Nav Links */}
            <ul className="navbar-nav fw-bold">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link text-dark"
                  onClick={closeOffcanvas}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/appointments"
                  className="nav-link text-dark"
                  onClick={() => {
                    closeOffcanvas();
                  }}
                >
                  All Appointments
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/career"
                  className="nav-link text-dark"
                  onClick={closeOffcanvas}
                >
                  Career
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/blog"
                  className="nav-link text-dark"
                  onClick={closeOffcanvas}
                >
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact-us"
                  className="nav-link text-dark"
                  onClick={closeOffcanvas}
                >
                  Contact Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/about-us"
                  className="nav-link text-dark"
                  onClick={closeOffcanvas}
                > About Us</Link>
              </li>
            </ul>

            {/* Fixed Bottom Login/Logout Button */}
            <div
              className="position-absolute bottom-0 start-0 w-100 px-3 pb-3 bg-white"
              style={{ zIndex: 10 }}
            >
              {isAuthenticated ? (
                <button
                  className="btn btn-danger w-100"
                  onClick={() => {
                    handleLogout();
                    closeOffcanvas();
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={closeOffcanvas}>
                  <button className="btn btn-danger w-100">Login</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Desktop menu */}
        <div className="collapse navbar-collapse d-none d-lg-block">
          <ul className="navbar-nav ms-auto fw-bold align-items-center gap-1">
            <li className="nav-item">
              <Link to="/" className="nav-link text-dark">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/career" className="nav-link text-dark">
                Career
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link text-dark">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact-us" className="nav-link text-dark">
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about-us" className="nav-link text-dark">About Us</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {user && <span className="text-dark fw-bold">{user.name}</span>}
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="button"
                  className="btn btn-link p-0"
                  id="userDropdown"
                  style={{ boxShadow: "none" }}
                >
                  <RiAccountCircleLine
                    size={38}
                    className="text-secondary mb-2"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={handleAppointments}
                    className="fw-bold"
                  >
                    <IoMdLogOut /> All Appointments
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout} className="fw-bold">
                    <IoMdLogOut /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleLoginClick}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Secondary Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark d-none d-lg-flex"
        style={{ backgroundColor: "#0074bc" }}
      >
        <div className="container">
          <ul className="navbar-nav mx-auto fw-bold gap-3">
            <li className="nav-item">
              <Link to="/patient-family" className="nav-link text-white">
                Patient & Family
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/education-trainings" className="nav-link text-white">
                Education & Trainings
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/donors-volunteers" className="nav-link text-white">
                Donors & Volunteers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clinical-service" className="nav-link text-white">
                Clinical Service
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/biorepository" className="nav-link text-white">
                Biorepository
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clinical-trials" className="nav-link text-white">
                Clinical Trials
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/research" className="nav-link text-white">
                Research
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/other-links" className="nav-link text-white">
                Other Links
              </Link>
            </li>
          </ul>
        </div>
        {isAuthenticated ? (
          <div
            className="d-lg-none w-100 text-white fw-bold d-flex justify-content-center align-items-center text-center"
            style={{ fontSize: "0.75rem" }}
          >
            <strong style={{ fontSize: "0.8rem" }}>Upcoming App:</strong>
            <span className="mx-2">
              {uppcomingAppointment
                ? `${uppcomingAppointment.doctor?.name || "N/A"} on ${new Date(
                    uppcomingAppointment.appointmentDate
                  ).toLocaleDateString()} at ${
                    uppcomingAppointment.appointmentTime
                  }`
                : "No upcoming appointment"}
            </span>
          </div>
        ) : null}
      </nav>
    </div>
  );
};

export default Navbar;
