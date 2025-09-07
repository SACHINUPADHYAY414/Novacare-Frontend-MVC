import React, { useState, useRef, memo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPowerOff } from "react-icons/fa";
import * as _ from "lodash";
import * as bootstrap from "bootstrap";
import { SiPolymerproject } from "react-icons/si";
import { RiProjectorFill } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa6";
import { AiFillFilePpt } from "react-icons/ai";
import { FaCartShopping } from "react-icons/fa6";
import { FcAbout } from "react-icons/fc";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";
import { HiHome } from "react-icons/hi2";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import "./Scrollbar/style.css";
import { SUCCESS_MSG } from "../../Utils/strings";
import { useDispatch } from "react-redux";
import { useToastr } from "../../Components/Toastr/ToastrProvider";
import { logout } from "../../Redux/authSlice";

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
  }
  //   {
  //     label: "All Notes",
  //     path: "/notes",
  //     icon: <AiFillFilePpt className="icon" />
  //   },
  //   {
  //     label: "Project Form",
  //     path: "/projectform",
  //     icon: <RiProjectorFill className="icon" />
  //   },
  //   {
  //     label: "Notes Form",
  //     path: "/notesform",
  //     icon: <FaFilePdf className="icon" />
  //   },
  //   {
  //     label: "Project Orders",
  //     path: "/projectorder",
  //     icon: <FaCartShopping className="icon" />
  //   },
  //   { label: "About", path: "/about", icon: <FcAbout className="icon" /> },
  //   {
  //     label: "All About",
  //     path: "/all-about",
  //     icon: <BsFillInfoSquareFill className="icon" />
  //   }
];

// Sidebar Component
const SidebarComponent = memo(
  ({
    sidebarOpen,
    toggleSidebar,
    isOffcanvas = false,
    closeOffcanvas,
    setIsMainContentPageFocused
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isSidebarFocused, setIsSidebarFocused] = useState(false);

    const width = sidebarOpen || isHovered ? "16.25rem" : "5.3rem";
    const offcanvasWidth = "14rem";

    const menuItems = navItems.map(({ path, label, icon }) =>
      <li className="dashboard-nav-item py-1" key={path}>
        <NavLink
          to={path}
          className="dashboard-nav-link text-white d-flex px-4 align-items-center"
        >
          <span className="ms-2">
            {icon}
          </span>
          {(sidebarOpen || isHovered || isOffcanvas) &&
            <span className="ms-2 mt-1">
              {label}
            </span>}
        </NavLink>
      </li>
    );

    if (isOffcanvas) {
      return (
        <div
          className="dashboard-offcanvas-start offcanvas offcanvas-start d-lg-none"
          style={{ width: offcanvasWidth, backgroundColor: "#0a5353" }}
          tabIndex={-1}
          id="offcanvasSidebar"
        >
          <div className="offcanvas-header justify-content-between align-items-center mt-1">
            <h2 className="fw-semibold fs-5 lh-1">Admin</h2>
            <RxCross2
              className="custom-link mb-2"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              onClick={closeOffcanvas}
              style={{ height: "1.5rem", width: "1.5rem", cursor: "pointer" }}
            />
          </div>
          <div className="offcanvas-body p-0 mt-3">
            <ul className="nav flex-column">
              {menuItems}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`d-none d-lg-block ${sidebarOpen
          ? "dashboard-sidebar-expanded"
          : "dashboard-sidebar-collapsed"}`}
        style={{ width, transition: "0.3s", backgroundColor: "#0a5353" }}
      >
        <div
          className={`dashboard-vh-100 ${isSidebarFocused
            ? "dashboard-overflow-y-auto"
            : "overflow-y-scroll no-width-scroll"}`}
          onMouseEnter={() => {
            setIsHovered(true);
            setIsSidebarFocused(true);
            setIsMainContentPageFocused(false);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsSidebarFocused(false);
          }}
        >
          <div
            className="p-3 d-flex justify-content-between align-items-center mt-4 ms-3"
            style={{ color: "#0AD8B5" }}
          >
            {(sidebarOpen || isHovered) &&
              <h2 className="fw-semibold fs-5 lh-1">Admin</h2>}
            {sidebarOpen
              ? <CgRadioChecked
                  style={{
                    height: "1.5rem",
                    width: "1.4rem",
                    cursor: "pointer"
                  }}
                  onClick={toggleSidebar}
                />
              : <CgRadioCheck
                  style={{
                    height: "1.5rem",
                    width: "1.4rem",
                    cursor: "pointer"
                  }}
                  onClick={toggleSidebar}
                />}
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
const Header = memo(({ handleLogout }) =>
  <header className="dashboard-navbar-header py-2 my-1 d-flex justify-content-between align-items-center">
    <FaRegBell
      color="#a7e5ba"
      size="23"
      style={{ position: "absolute", right: "3.5rem", cursor: "pointer" }}
    />
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
      <button
        className="btn border-0 align-items-center"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
      >
        <FaUserCircle
          className="cursor-pointer border-0 rounded-circle text-white"
          style={{ height: "2.4rem", width: "2.4rem" }}
        />
      </button>
      <ul className="dropdown-menu rounded border-0 mt-2">
        <li>
          <button
            className="dropdown-item fw-semibold d-flex"
            onClick={handleLogout}
          >
            <FaPowerOff className="me-1 fs-6 mt-1" /> Logout
          </button>
        </li>
      </ul>
    </div>
  </header>
);

// Dashboard Page
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMainContentPageFocused, setIsMainContentPageFocused] = useState(
    false
  );

  const dispatch = useDispatch();
  const { customToast } = useToastr();
  const offcanvasRef = useRef(null);
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

  return (
    <div
      className="d-flex w-100 min-vh-100"
      onMouseLeave={() => setIsMainContentPageFocused(false)}
    >
      <SidebarComponent
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        setIsMainContentPageFocused={setIsMainContentPageFocused}
      />

      <SidebarComponent
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isOffcanvas={true}
        closeOffcanvas={closeOffcanvas}
        offcanvasRef={offcanvasRef}
      />

      <div className="dashboard-main-content d-flex flex-column w-100">
        <div className="dashboard-header-background-color rounded dashboard-mx-3 mt-3">
          <Header handleLogout={handleLogout} />
        </div>
        <main
          className="flex-grow-1"
          onMouseEnter={() => setIsMainContentPageFocused(true)}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
