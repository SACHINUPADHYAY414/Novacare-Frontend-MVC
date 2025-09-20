import React, { useEffect, useState } from "react";
import ClinicalService from "./ClinicalService";
import {
  COMPANY_NAME,
  OPPS_MSG,
  SERVER_ERROR,
  COMPANY_START,
  PLEASE_SELECT_DOCTOR,
  NO_DOCTORS_FOUND,
  WARNING
} from "../../Utils/strings";
import Footer from "../../Components/Footer/Footer";
import api from "../../Components/Action/Api";
import { useToastr } from "../../Components/Toastr/ToastrProvider.jsx";
import DoctorCard from "../../Components/DoctorCard/DoctorCard.jsx";
import { Tooltip, Whisper, Button } from "rsuite";
import images, { blogs, landingBackground } from "../../Utils/ImagesData.js";
import UnderLine from "../../Components/UnderLine/UnderLine.jsx";
import { FiArrowRight } from "react-icons/fi";
import Ellipses from "../../Components/Ellipses/Ellipses.jsx";
import { getDoctorProfileImage } from "../../Utils/DoctorProfile.js";

const Home = ({ from = "" }) => {
  const { customToast } = useToastr();
  const [doctor, setDoctor] = useState("");
  const [fetchDoctors, setFetchDoctors] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const companyStartDate = new Date(COMPANY_START);
  const [isHovered, setIsHovered] = useState(false);

  const currentDate = new Date();
  let yearlyExperience =
    currentDate.getFullYear() - companyStartDate.getFullYear();
  const hasAnniversaryPassed =
    currentDate.getMonth() > companyStartDate.getMonth() ||
    (currentDate.getMonth() === companyStartDate.getMonth() &&
      currentDate.getDate() >= companyStartDate.getDate());

  if (!hasAnniversaryPassed) {
    yearlyExperience -= 1;
  }
  const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(3);
  const [gridClass, setGridClass] = useState(" col-sm-4 col-md-4");
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const screenWidth = window.innerWidth;

    if (from === "Hero") {
      if (screenWidth < 1200) {
        setITEMS_PER_PAGE(2);
        setGridClass(" col-sm-6 col-md-6");
      } else if (screenWidth >= 1200 && screenWidth < 1450) {
        setITEMS_PER_PAGE(3);
        setGridClass(" col-sm-4 col-md-4");
      } else {
        setITEMS_PER_PAGE(3);
        setGridClass(" col-sm-4 col-md-4");
      }
    } else {
      if (screenWidth < 1450) {
        setITEMS_PER_PAGE(3);
        setGridClass(" col-sm-4 col-md-4");
      } else {
        setITEMS_PER_PAGE(4);
        setGridClass(" col-sm-3 col-md-3");
      }
    }
  }, [from]);

  const totalDoctors = doctors.length;
  const totalPages = Math.ceil(totalDoctors / ITEMS_PER_PAGE);

  const paginatedDoctors = doctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [respDoctor, resSpecialties] = await Promise.all([
          api.get("/api/doctor/all"),
          api.get("/api/specialization/all")
        ]);
        setFetchDoctors(respDoctor.data || []);
        setSpecialties(resSpecialties.data || []);
      } catch (e) {
        setFetchDoctors([]);
        setSpecialties([]);
        setHasError(true);
        const errorMessage = e?.response?.data?.message || SERVER_ERROR;
        customToast({
          severity: "error",
          summary: OPPS_MSG,
          detail: errorMessage,
          life: 4000
        });
      }
    };

    fetchDropdownData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!specialty && !doctor) {
      customToast({
        severity: "warn",
        summary: WARNING,
        detail: PLEASE_SELECT_DOCTOR,
        life: 3000,
        sticky: false,
        closable: true
      });
      return;
    }
    try {
      const params = new URLSearchParams();
      if (specialty) params.append("specializationId", specialty);
      if (doctor) params.append("doctorId", doctor);
      const response = await api.get(
        `/api/duty-roster/search-doctor?${params.toString()}`
      );
      const result = response.data;
      if (!result || (Array.isArray(result) && result.length === 0)) {
        customToast({
          severity: "warn",
          summary: WARNING,
          detail: NO_DOCTORS_FOUND,
          life: 3000,
          sticky: false,
          closable: true
        });
        setDoctors([]);
        setCurrentPage(1);
        setShowResults(false);
        return;
      }

      setDoctors(result);
      setShowResults(true);
      setCurrentPage(1);
    } catch (error) {
      setDoctors([]);
      setShowResults(false);
      setCurrentPage(1);

      if (error.response?.status === 404) {
        customToast({
          severity: "warn",
          summary: SERVER_ERROR,
          detail: NO_DOCTORS_FOUND,
          life: 3000,
          sticky: false,
          closable: true
        });
      } else {
        customToast({
          severity: "error",
          summary: OPPS_MSG,
          detail:
            error.response?.data?.message || error.message || SERVER_ERROR,
          life: 3000,
          sticky: false,
          closable: true
        });
      }
    }
  };

  const handleClose = () => {
    setShowResults(false);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % landingBackground.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div
        className="hero-section text-white text-center position-relative"
        style={{
          overflow: "hidden",
          backgroundImage: `url("${landingBackground[currentImageIndex]}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 1s ease-in-out",
          zIndex: 0,
          minHeight: "81vh"
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 1,
            pointerEvents: "none"
          }}
        ></div>

        <div
          className="container position-relative d-flex flex-column justify-content-center align-items-center text-white text-center"
          style={{ zIndex: 1, minHeight: "63vh" }}
        >
          <div className="row g-1 justify-content-center w-100">
            <div className="col-12 col-lg-8 text-black">
              <h5
                className="display-3 fw-bold mb-3 text-white glow-text"
                style={{
                  letterSpacing: "2px",
                  textShadow: "0 0 15px #fd6b6b"
                }}
              >
                Find the Best Doctor
              </h5>
              <p className="lead mb-4 text-white fw-bold">
                Search by doctor and specialty to book your appointment
              </p>
              <div className="bg-white rounded p-4 p-sm-3 p-md-4 pe-4 pe-sm-3 pe-md-4 position-relative">
                {totalDoctors > 0 && showResults && (
                  <button
                    className="position-absolute top-0 end-0 translate-middle bg-transparent text-danger border-0 d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      marginTop: "-0.02rem",
                      marginRight: "-1.8rem",
                      zIndex: 10,
                      fontSize: "1.25rem",
                      lineHeight: 1,
                      fontWeight: "bold"
                    }}
                    aria-label="Close"
                    onClick={handleClose}
                  >
                    &times;
                  </button>
                )}
                <form
                  onSubmit={handleSearch}
                  className="row g-3 align-items-end"
                >
                  {/* Doctor select */}
                  <div
                    className="col-12 col-md-6 col-lg-5 position-relative"
                    style={{ minWidth: "250px" }}
                  >
                    <select
                      id="doctor"
                      name="doctor"
                      aria-label="Doctor"
                      value={doctor}
                      onChange={(e) => setDoctor(e.target.value)}
                      className="form-select border-2 border-purple rounded-3"
                    >
                      <option value="">Choose Doctor...</option>
                      {fetchDoctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>

                    <label
                      htmlFor="doctor"
                      className="position-absolute top-0 start-0 bg-white"
                      style={{
                        transform: "translate(12px, -50%)",
                        fontSize: "1.2rem",
                        fontWeight: "500"
                      }}
                    >
                      Doctor
                    </label>
                  </div>

                  {/* Specialty Select */}
                  <div
                    className="col-12 col-md-6 col-lg-5 position-relative"
                    style={{ minWidth: "250px" }}
                  >
                    <select
                      id="specialtySelect"
                      name="specialty"
                      aria-label="Specialty"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="form-select border-2 border-purple rounded-3"
                    >
                      <option value="">Choose Specialty...</option>
                      {specialties.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="specialtySelect"
                      className="position-absolute top-0 start-0 bg-white"
                      style={{
                        transform: "translate(12px, -50%)",
                        fontSize: "1.2rem",
                        fontWeight: "500"
                      }}
                    >
                      Specialty
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 col-md-12 col-lg-2 d-grid">
                    <button
                      type="submit"
                      className="btn btn-danger"
                      style={{ maxWidth: "100%", paddingTop: "0.4rem" }}
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Doctor Cards Section Below Hero */}
              {totalDoctors > 0 && showResults && (
                <div className="my-1 card">
                  <>
                    <div className="row g-1 mx-2 my-1 pb-0">
                      {paginatedDoctors.map((doc) => {
                        const matchedDoctor = fetchDoctors.find(
                          (d) => d.id === doc.doctorId
                        );
                        const enrichedDoctor = {
                          ...doc,
                          name: matchedDoctor?.name,
                          gender: matchedDoctor?.gender,
                          profilePic: matchedDoctor?.profileImageUrl
                        };
                        return (
                          <div
                            key={doc.doctorId}
                            className={"col-12 " + gridClass}
                          >
                            <div className="card shadow-lg rounded-3 h-100 overflow-hidden doctor-card">
                              <DoctorCard doctor={enrichedDoctor} />
                            </div>
                          </div>
                        );
                      })}

                      {/* Pagination Controls */}
                      <div className="row pb-0">
                        <div className="col-12 d-flex justify-content-center gap-3">
                          <Whisper
                            placement="top"
                            trigger="hover"
                            speaker={<Tooltip>Previous Page</Tooltip>}
                          >
                            <Button
                              appearance="link"
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              style={{ fontSize: "1.5rem" }}
                            >
                              &#xab;
                            </Button>
                          </Whisper>

                          <Whisper
                            placement="top"
                            trigger="hover"
                            speaker={<Tooltip>Refresh</Tooltip>}
                          >
                            <Button
                              appearance="link"
                              onClick={() => window.location.reload()}
                              style={{ fontSize: "1.5rem" }}
                            >
                              &#x21bb;
                            </Button>
                          </Whisper>

                          <Whisper
                            placement="top"
                            trigger="hover"
                            speaker={<Tooltip>Next Page</Tooltip>}
                          >
                            <Button
                              appearance="link"
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              style={{ fontSize: "1.5rem" }}
                            >
                              &#xbb;
                            </Button>
                          </Whisper>
                        </div>
                      </div>
                      <div className="text-end text-muted mt-0 pt-0=">
                        Found {totalDoctors} doctor{totalDoctors > 1 ? "s" : ""}
                      </div>
                    </div>
                  </>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div
        className="container-fluid py-5"
        style={{
          backgroundImage: `url(${images.background1})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "#0074bc"
        }}
      >
        <div className="container">
          <div className="row align-items-center text-white">
            <div className="col-md-6">
              <h2 className="display-6 mb-4">
                Why Choose <strong>{COMPANY_NAME}</strong>: <br />
                <span>A Silver Line</span>
              </h2>

              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-info"
                  style={{ height: "4px", width: "40px" }}
                ></div>
                <div
                  className="bg-danger rounded-circle mx-2"
                  style={{ width: "8px", height: "8px" }}
                ></div>
                <div
                  className="bg-info"
                  style={{ height: "4px", width: "40px" }}
                ></div>
              </div>

              <ul className="list-unstyled fs-5">
                <li className="mb-3 d-flex">
                  <span className="text-danger fw-bold me-2">&#10003;</span>
                  Comprehensive cancer care provided under one roof.
                </li>
                <li className="mb-3 d-flex">
                  <span className="text-danger fw-bold me-2">&#10003;</span>
                  We focus on all aspects of cancer care from prevention to
                  palliation.
                </li>
                <li className="mb-3 d-flex">
                  <span className="text-danger fw-bold me-2">&#10003;</span>
                  We practice evidence-based medicine.
                </li>
                <li className="mb-3 d-flex">
                  <span className="text-danger fw-bold me-2">&#10003;</span>
                  Up to 21% discount on medicines and up to 50% discount on
                  consumables.
                </li>
              </ul>

              <a
                href="#"
                className="btn btn-danger mt-2 mx-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More
              </a>
            </div>

            <div className="d-none d-md-flex col-md-1 justify-content-center">
              <div
                className="bg-secondary"
                style={{ width: "2px", height: "300px" }}
              ></div>
            </div>

            <div className="col-md-5 text-center mt-5 mt-md-0">
              <div className="position-relative d-inline-block">
                <img
                  src={images.year}
                  alt="goldLogo"
                  className="img-fluid rotate-circle"
                />
                <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
                  <h2 className="fw-bold">
                    <span>{yearlyExperience}</span> Years
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other sections */}
      <div>
        <ClinicalService />
        {!hasError && (
          <div className="container text-center">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="fw-bold text-secondary fs-2 mb-0 mx-auto text-center">
                Our <span className="text-danger">Specialist</span>
                <UnderLine />
              </h2>
              <a
                href="find-doctors"
                className="text-decoration-none text-danger fw-bolder text-decoration-underline"
              >
                View All
              </a>
            </div>

            <div className="row gx-3 gy-5 py-3 pb-2">
              {fetchDoctors.slice(0, 12).map((doctor) => {
                const isHovere = isHovered === doctor.id;

                return (
                  <div
                    key={doctor.id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 pt-2"
                  >
                    <div
                      className="card image-card text-center p-3 pb-0 d-flex flex-column"
                      style={{
                        height: "160px",
                        boxShadow: isHovere
                          ? "0 4px 15px rgba(0,0,0,0.2)"
                          : "none",
                        transition: "box-shadow 0.3s ease, transform 0.3s ease",
                        transform: isHovere
                          ? "translateY(-5px)"
                          : "translateY(0)",
                        cursor: "pointer"
                      }}
                      onMouseEnter={() => setIsHovered(doctor.id)}
                      onMouseLeave={() => setIsHovered(null)}
                    >
                      <div
                        className="rounded-circle mx-auto d-block"
                        style={{
                          width: "80px",
                          height: "80px",
                          marginTop: "-60px",
                          borderRadius: "50%",
                          backgroundImage: `url("${images.background3}")`,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          overflow: "hidden"
                        }}
                      >
                        <img
                          src={getDoctorProfileImage(doctor)}
                          alt={`${doctor.name || "Doctor"} profile`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                            transform: "scale(1.15)",
                            backgroundColor: "transparent",
                            display: "block"
                          }}
                          onError={(e) => {
                            e.target.src = images.defaultDoctorImage;
                          }}
                        />
                      </div>

                      <div className="card-body d-flex flex-column flex-grow-1 text-nowrap">
                        <div className="text-center fw-semibold">
                          <Ellipses
                            text={doctor.name}
                            maxChars={20}
                            className="text-muted"
                          />
                        </div>
                        <div className="text-center">
                          <Ellipses
                            text={
                              doctor.specializationName ||
                              doctor.specialtyName ||
                              ""
                            }
                            maxChars={20}
                            className="text-muted"
                          />
                        </div>

                        <div className="mt-auto mx-auto pt-2">
                          <a
                            href="#"
                            className="btn btn-outline-danger btn-sm w-100"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="container text-center">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold text-secondary fs-2 mb-0 mx-auto text-center">
              Treatment <span className="text-danger">Services</span>
              <UnderLine />
            </h2>
            <a
              href="blog"
              className="text-decoration-none text-danger fw-bolder text-decoration-underline"
            >
              View All
            </a>
          </div>

          <div className="row">
            {blogs.slice(0, 3).map((blog, index) => (
              <div
                className="col-12 col-md-4 mb-4"
                style={{ cursor: "pointer" }}
                key={blog.id || index}
              >
                <div className="card h-100">
                  <img
                    src={blog.image}
                    className="card-img-top"
                    alt={blog.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="card-title fw-bold">{blog.title}</h6>
                    <p className="card-text text-muted small mb-2">
                      {blog.description}
                    </p>
                    <a
                      href="#"
                      className="text-decoration-none fw-bold d-flex align-items-center justify-content-center"
                    >
                      <FiArrowRight size={20} />
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
