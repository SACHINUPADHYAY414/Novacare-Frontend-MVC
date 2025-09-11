import React, { useState, useRef, useEffect, memo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPowerOff, FaUserTie } from "react-icons/fa";
import { SiPolymerproject } from "react-icons/si";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import * as bootstrap from "bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useToastr } from "../../Components/Toastr/ToastrProvider";
import { logout } from "../../Redux/authSlice";
import { SUCCESS_MSG } from "../../Utils/strings";
import Loader from "../../Components/Loader/Loader";
import "./Scrollbar/style.css";

// Navigation links
const navItems = [
  {
    label: "All Users",
    path: "/dashboard/users",
    icon: <FaUserTie className="icon" />
  },
  {
    label: "Doctors",
    path: "/dashboard/doctors",
    icon: <SiPolymerproject className="icon" />
  },
  {
    label: "Specialty",
    path: "/dashboard/specialty",
    icon: <SiPolymerproject className="icon" />
  },
  {
    label: "DutyRoster",
    path: "/dashboard/dutyRoster",
    icon: <SiPolymerproject className="icon" />
  },
  {
    label:"Appointments",
    path:"/dashboard/appointments-list",
    icon:<SiPolymerproject className="icon"/>
  },
  {
    label: "Users Enquary",
    path: "/dashboard/enquary",
    icon: <SiPolymerproject className="icon" />
  }
];

// Sidebar Component
const SidebarComponent = memo(
  ({
    sidebarOpen,
    toggleSidebar,
    isOffcanvas = false,
    closeOffcanvas,
    setIsMainContentPageFocused,
    offcanvasRef
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isSidebarFocused, setIsSidebarFocused] = useState(false);
    const navigate = useNavigate();

    const width = sidebarOpen || isHovered ? "16.25rem" : "5.3rem";
    const offcanvasWidth = "14rem";

    const handleHome = () => {
      navigate("/dashboard");
    };

    const menuItems = navItems.map(({ path, label, icon }) => (
      <li className="dashboard-nav-item" key={path}>
        <NavLink
          to={path}
          className={({ isActive }) =>
            `nav-link dashboard-nav-link text-decoration-none text-white d-flex px-4 align-items-center ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="ms-1">{icon}</span>
          {(sidebarOpen || isHovered || isOffcanvas) && (
            <span className="ms-2 mt-1">{label}</span>
          )}
        </NavLink>
      </li>
    ));

    // Mobile (Offcanvas)
    if (isOffcanvas) {
      return (
        <div
          ref={offcanvasRef}
          className="dashboard-offcanvas-start offcanvas offcanvas-start d-lg-none"
          style={{
            width: offcanvasWidth,
            backgroundColor: "#0a5353",
            zIndex: 1050
          }}
          tabIndex={-1}
          id="offcanvasSidebar"
        >
          <div className="offcanvas-header justify-content-between align-items-center mt-1">
            <h2
              className="fw-semibold fs-5 lh-1 text-white"
              onClick={handleHome}
              style={{ cursor: "pointer" }}
            >
              Admin
            </h2>
            <RxCross2
              className="custom-link mb-2"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              onClick={closeOffcanvas}
              style={{ height: "1.5rem", width: "1.5rem", cursor: "pointer" }}
            />
          </div>
          <div className="offcanvas-body p-0 mt-3">
            <ul className="nav flex-column">{menuItems}</ul>
          </div>
        </div>
      );
    }

    // Desktop Sidebar
    return (
      <div
        className={`d-none d-lg-block ${
          sidebarOpen
            ? "dashboard-sidebar-expanded"
            : "dashboard-sidebar-collapsed"
        }`}
        style={{ width, transition: "0.3s", backgroundColor: "#0a5353" }}
        onMouseEnter={() => {
          setIsHovered(true);
          setIsSidebarFocused(true);
          if (setIsMainContentPageFocused) setIsMainContentPageFocused(false);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsSidebarFocused(false);
        }}
      >
        <div
          className={`dashboard-vh-100 ${
            isSidebarFocused
              ? "dashboard-overflow-y-auto"
              : "overflow-y-scroll no-width-scroll"
          }`}
        >
          <div
            className="p-3 d-flex justify-content-between align-items-center mt-4 ms-3"
            style={{ color: "#0AD8B5" }}
          >
            {(sidebarOpen || isHovered) && (
              <h2
                className="fw-semibold fs-5 lh-1"
                onClick={handleHome}
                style={{ cursor: "pointer" }}
              >
                Admin
              </h2>
            )}
            {sidebarOpen ? (
              <CgRadioChecked
                style={{ height: "1.5rem", width: "1.4rem", cursor: "pointer" }}
                onClick={toggleSidebar}
                title="Collapse Sidebar"
              />
            ) : (
              <CgRadioCheck
                style={{ height: "1.5rem", width: "1.4rem", cursor: "pointer" }}
                onClick={toggleSidebar}
                title="Expand Sidebar"
              />
            )}
          </div>
          <ul
            className="nav flex-column mt-3"
            style={{
              textDecoration: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {menuItems}
          </ul>
        </div>
      </div>
    );
  }
);

// Header Component
const Header = memo(({ handleLogout, user }) => (
  <header
    className="dashboard-navbar-header py-2 my-1 d-flex justify-content-between align-items-center"
    style={{ position: "relative", zIndex: 1040 }}
  >
    <button
      className="btn d-lg-none text-light border-0"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasSidebar"
      aria-controls="offcanvasSidebar"
      title="Toggle Sidebar"
    >
      <RxHamburgerMenu
        className="text-white"
        style={{ height: "1.5rem", width: "1.5rem" }}
      />
    </button>

    <div className="d-flex align-items-center ms-auto position-relative">
      {user?.name && (
        <h6 className="text-white fw-semibold mb-0">{user.name}</h6>
      )}
      <button
        className="btn border-0 align-items-center"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <FaUserCircle
          className="cursor-pointer border-0 rounded-circle text-white"
          style={{ height: "2.4rem", width: "2.4rem" }}
        />
      </button>
      <ul className="dropdown-menu rounded border-0 mt-2">
        <li>
          <button
            className="dropdown-item fw-semibold d-flex align-items-center"
            onClick={handleLogout}
          >
            <FaPowerOff className="me-2 fs-6" /> Logout
          </button>
        </li>
      </ul>
    </div>
  </header>
));

// Dashboard Component
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMainContentPageFocused, setIsMainContentPageFocused] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const offcanvasRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { customToast } = useToastr();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  const closeOffcanvas = () => {
    if (offcanvasRef.current) {
      const offcanvas = new bootstrap.Offcanvas(offcanvasRef.current);
      offcanvas.hide();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="dashboard-layout-wrapper d-flex w-100 min-vh-100"
      onMouseLeave={() => setIsMainContentPageFocused(false)}
    >
      {/* Desktop Sidebar */}
      <SidebarComponent
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        setIsMainContentPageFocused={setIsMainContentPageFocused}
      />

      {/* Mobile Offcanvas Sidebar */}
      <SidebarComponent
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isOffcanvas={true}
        closeOffcanvas={closeOffcanvas}
        offcanvasRef={offcanvasRef}
      />

      {/* Main Content */}
      <div
        className="dashboard-main-content d-flex flex-column w-100"
        onMouseLeave={() => setIsMainContentPageFocused(false)}
      >
        <div className="dashboard-header-background-color rounded mx-3 mt-3">
          <Header handleLogout={handleLogout} user={user} />
        </div>
        <main
          className="mx-1"
          onMouseEnter={() => setIsMainContentPageFocused(true)}
        >
          {isLoading ? <Loader /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
