import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useToastr } from "../../Components/Toastr/ToastrProvider.jsx";
import {
  OPPS_MSG,
  INVALID_SLOT,
  INVALID_SLOT_DETAIL,
  APPOINTMENT_BOOKED_SUCCESS,
  NO_DOCTORS_FOUND,
  DOCTOR_REQUIRED,
  PLEASE_SELECT_DOCTOR,
  BOOKING_SLOT_ALREADY_BOOKED,
  SEARCH_FAILED,
  ERROR,
  WARNING,
  SUCCESS_MSG,
  SERVER_ERROR,
  COMPANY_LOCATION
} from "../../Utils/strings";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  clearSelectedDoctor,
  setSelectedDoctor
} from "../../Redux/doctorSlice.js";
import api from "../../Components/Action/Api.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getDoctorProfileImage,
  getDoctorQualification
} from "../../Utils/DoctorProfile.js";
import Ellipses from "../../Components/Ellipses/Ellipses.jsx";
import images from "../../Utils/ImagesData.js";

const MySwal = withReactContent(Swal);

const DoctorSlot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customToast } = useToastr();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const doctor = useSelector((state) => state.doctor.selectedDoctor);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [fetchDoctors, setFetchDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const dateScrollerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!doctor) {
      navigate("/", { replace: true });
    }
  }, []);

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
        const errorMessage = e?.response?.data?.message || SERVER_ERROR;
        e.message ||
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

  useEffect(() => {
    return () => {
      if (window.location.pathname !== "/doctor-slot") {
        dispatch(clearSelectedDoctor());
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (doctor?.duration?.length) {
      setSelectedDate(doctor.duration[0].dutyDate);
    } else {
      setSelectedDate(null);
    }
    setSelectedSlot("");
  }, [doctor]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const showDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const generateTimeSlots = (
    date,
    fromTime,
    toTime,
    duration,
    dutyRosterId,
    bookedSlots = [],
    amount
  ) => {
    const slots = [];
    const start = new Date(`${date}T${fromTime}`);
    const end = new Date(`${date}T${toTime}`);
    const bookedSet = new Set(bookedSlots);

    while (start < end) {
      const slotTimeStr = start.toTimeString().slice(0, 5);
      const isBooked = bookedSet.has(slotTimeStr);

      slots.push({
        label: formatTime(start),
        full: `${date}T${slotTimeStr}`,
        status: isBooked ? "BOOKED" : "AVAILABLE",
        dutyRosterId,
        isAvailable: !isBooked,
        amount
      });

      start.setMinutes(start.getMinutes() + duration);
    }
    return slots;
  };

  const allDates = useMemo(() => {
    if (!doctor?.duration) return [];
    const uniqueDates = [
      ...new Set(doctor.duration.map((slot) => slot.dutyDate))
    ];
    return uniqueDates.sort((a, b) => new Date(a) - new Date(b));
  }, [doctor]);

  const allSlots = useMemo(() => {
    if (!doctor?.duration || !selectedDate) return [];

    return doctor.duration
      .filter((slot) => slot.dutyDate === selectedDate)
      .flatMap((slot) =>
        generateTimeSlots(
          slot.dutyDate,
          slot.fromTime,
          slot.toTime,
          slot.duration,
          slot.dutyRosterId || slot.id,
          slot.bookedAppointmentTimes || [],
          slot.amount || doctor.consultationFee
        )
      );
  }, [doctor, selectedDate]);

  const checkOverflow = () => {
    const el = dateScrollerRef.current;
    if (el && el.scrollWidth && el.clientWidth) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  const scrollContainer = (direction) => {
    const container = dateScrollerRef.current;
    if (!container) return;
    const scrollAmount = 150;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };
  const scrollToSelectedDate = (dateStr) => {
    const el = document.getElementById(`date-btn-${dateStr}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  };

  useEffect(() => {
    if (selectedDate) scrollToSelectedDate(selectedDate);
  }, [selectedDate]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (isSubmitted) return;
    setIsSubmitted(true);

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const selectedSlotObj = allSlots.find((slot) => slot.full === selectedSlot);

    if (!selectedSlotObj) {
      customToast({
        severity: "warn",
        summary: INVALID_SLOT,
        detail: "Please select a valid time slot before booking.",
        life: 3000
      });
      setIsSubmitted(false);
      return;
    }

    const [appointmentDate, timeWithSeconds] = selectedSlot.split("T");
    const appointmentTime = timeWithSeconds.slice(0, 5);
    const amount = selectedSlotObj.amount || doctor.consultationFee || 0;

    try {
      const orderResponse = await api.post("/api/appointments/payment/order", {
        amount
      });

      if (!(orderResponse.status === 200 || orderResponse.status === 201)) {
        throw new Error("Failed to create payment order");
      }

      const orderData = orderResponse.data;

      const options = {
        key: "rzp_test_RNEbI8mcPHk4xG",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Novacare",
        description: "Consultation Fee",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const payload = {
              userId: user.id,
              doctorId: doctor.id || doctor.doctorId,
              dutyRosterId: selectedSlotObj.dutyRosterId,
              status: "BOOKED",
              appointmentDate,
              appointmentTime,
              amount: selectedSlotObj.amount,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };

            const bookingResponse = await api.post(
              "/api/appointments/book/after-payment",
              payload
            );

            if (
              bookingResponse.status === 200 ||
              bookingResponse.status === 201
            ) {
              customToast({
                severity: "success",
                summary: SUCCESS_MSG,
                detail: APPOINTMENT_BOOKED_SUCCESS,
                life: 3000
              });
              setSelectedSlot("");
              navigate("/", { replace: true });
            } else {
              throw new Error("Booking failed after payment");
            }
          } catch (error) {
            customToast({
              severity: "error",
              summary: OPPS_MSG,
              detail:
                error?.response?.data?.message ||
                error?.message ||
                "Failed to book appointment after payment",
              life: 4000
            });
            setIsSubmitted(false);
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ""
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        customToast({
          severity: "error",
          summary: "Payment Failed",
          detail:
            response.error.description || "Payment failed. Please try again.",
          life: 4000
        });
        setIsSubmitted(false);
      });

      rzp.open();
    } catch (error) {
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: error?.response?.data?.message || error.message || SERVER_ERROR,
        life: 4000
      });
      setIsSubmitted(false);
    }
  };

  const runSearch = async (filters) => {
    try {
      const params = new URLSearchParams();

      const prevDoctor = doctor;

      const doctorIdToUse =
        filters.doctorId || prevDoctor?.id || prevDoctor?.doctorId || null;

      if (!doctorIdToUse) {
        customToast({
          severity: WARNING,
          summary: DOCTOR_REQUIRED,
          detail: PLEASE_SELECT_DOCTOR,
          life: 3000
        });
        return;
      }

      params.append("doctorId", doctorIdToUse);
      if (filters.specId) params.append("specializationId", filters.specId);
      if (filters.date) params.append("dutyDate", filters.date);

      const resp = await api.get(
        `/api/duty-roster/search-doctor?${params.toString()}`
      );
      const results = resp.data || [];
      if (!results.length) {
        customToast({
          severity: WARNING,
          summary: ERROR,
          detail: NO_DOCTORS_FOUND,
          life: 3000
        });
        return;
      }

      const newDoctorData = results[0];

      let updatedDoctor;

      if (filters.doctorId) {
        updatedDoctor = {
          ...newDoctorData,
          duration: prevDoctor?.duration || []
        };
      } else {
        updatedDoctor = {
          ...prevDoctor
        };
      }

      if (filters.doctorId) {
        dispatch(setSelectedDoctor(updatedDoctor));
      }

      let newSelectedDate = filters.date || null;
      const availableDates = updatedDoctor.duration.map((d) => d.dutyDate);

      const todayStr = new Date().toISOString().split("T")[0];

      if (!newSelectedDate) {
        const futureDates = availableDates.filter((date) => date >= todayStr);

        if (futureDates.length > 0) {
          newSelectedDate = futureDates.sort()[0];
        } else if (availableDates.length > 0) {
          newSelectedDate = availableDates.sort().reverse()[0];
        } else {
          newSelectedDate = null;
        }
      }

      if (newSelectedDate) {
        setTimeout(() => {
          setSelectedDate(newSelectedDate);
          setTimeout(() => {
            scrollToSelectedDate(newSelectedDate);
          }, 100);
        }, 100);
      }
    } catch (e) {
      const errorMessage =
        e?.response?.data?.message || e.message || SEARCH_FAILED;

      customToast({
        severity: "error",
        summary: ERROR,
        detail: errorMessage,
        life: 3000
      });
    }
  };

  const openSearch = async () => {
    const { value } = await MySwal.fire({
      title: "Search Doctor",
      html: `
        <div class="mb-2">
          <label>Doctor</label>
          <select id="swal-doctor" class="form-select">
            <option value="">Select...</option>
            ${fetchDoctors
              .map((d) => `<option value="${d.id}">${d.name}</option>`)
              .join("")}
          </select>
        </div>
        <div class="mb-2" id="swal-spec-container" style="display: none;">
          <label>Specialty</label>
          <select id="swal-spec" class="form-select">
            <option value="">Select...</option>
            ${specialties
              .map((s) => `<option value="${s.id}">${s.name}</option>`)
              .join("")}
          </select>
        </div>
        <div class="mb-2">
          <label>Date</label>
          <input id="swal-date" type="date" class="form-control" />
        </div>
        <script>
          const doctorSelect = document.getElementById("swal-doctor");
          doctorSelect.addEventListener("change", () => {
            const specDiv = document.getElementById("swal-spec-container");
            specDiv.style.display = doctorSelect.value ? "block" : "none";
          });
        </script>
      `,
      showCancelButton: true,
      confirmButtonText: "Search"
    });

    if (value) {
      const doctorId = document.getElementById("swal-doctor").value;
      const specId = document.getElementById("swal-spec").value;
      const date = document.getElementById("swal-date").value;

      await runSearch({ doctorId, specId, date });
    }
  };

  const matchedDoctor = fetchDoctors.find(
    (d) => d.id === doctor?.id || d.id === doctor?.doctorId
  );
  const displayedAmount = React.useMemo(() => {
    if (!allSlots.length) return null;

    const slot = allSlots.find((s) => s.full === selectedSlot);

    if (slot) return slot.amount;
    return allSlots[0].amount;
  }, [allSlots, selectedSlot]);

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12 col-md-3 mt-md-2">
          <div className="card shadow-sm text-center p-3 doctor-profile-card">
            <div
              className="rounded-circle mx-auto d-block img-fluid rounded-circle mx-auto mb-2 doctor-profile-img"
              style={{
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
                src={getDoctorProfileImage(matchedDoctor)}
                alt={`${doctor.doctorName || "Doctor"} profile`}
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
            <h5 className="mt-2 fw-bold doctor-name">{doctor.doctorName}</h5>
            <div className="text-center mt-auto fw-semibold mb-1">
              <Ellipses
                text={doctor.specialization}
                maxChars={50}
                className="text-muted"
              />
            </div>
            <div className="text-center mt-auto mb-1">
              <Ellipses
                text={getDoctorQualification(matchedDoctor)}
                maxChars={50}
                className="text-muted"
              />
            </div>
          </div>
        </div>
        {/* Slot Booking */}
        <div className="col-12 col-md-9">
          <div className="d-flex flex-column flex-md-row align-items-center gap-md-0 justify-content-center justify-content-md-between">
            <h4 className="fw-bold mb-md-0 text-center text-md-start">
              Book Appointment
            </h4>

            <div className="d-flex mb-2 fw-semibold flex-row flex-md-row align-items-center justify-content-between gap-2">
              <div
                className="d-flex align-items-center gap-1"
                onClick={openSearch}
                style={{ cursor: "pointer" }}
              >
                <FiSearch className="text-primary" />
                <span>Search</span>
              </div>{" "}
              <span>
                , Date:{" "}
                {selectedDate ? showDate(selectedDate) : "No date selected"}{" "}
              </span>
              <div className="d-flex align-items-center gap-1">
                <FaLocationDot className="text-danger mb-1" />
                <span>{COMPANY_LOCATION}</span>
              </div>
            </div>
          </div>

          <div className="position-relative px-3 mb-2">
            {isOverflowing && (
              <button
                type="button"
                className="position-absolute start-0 top-50 translate-middle-y border-0 bg-transparent"
                style={{
                  zIndex: 10,
                  color: "gray",
                  cursor: "pointer",
                  marginLeft: "-0.4rem"
                }}
                onClick={() => scrollContainer("left")}
                aria-label="Scroll left"
              >
                <FaChevronLeft size={18} />
              </button>
            )}
            <div
              ref={dateScrollerRef}
              className="d-flex gap-2 overflow-auto flex-nowrap scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {allDates.map((date) => (
                <button
                  key={date}
                  id={`date-btn-${date}`}
                  type="button"
                  className={`btn flex-shrink-0 rounded ${
                    selectedDate === date
                      ? "btn-success"
                      : "btn-outline-secondary"
                  } px-1 py-1`}
                  style={{
                    minWidth: "80px",
                    fontSize: "0.9rem"
                  }}
                  onClick={() => runSearch({ date })}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
            {isOverflowing && (
              <button
                type="button"
                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent p-1"
                style={{
                  zIndex: 10,
                  color: "gray",
                  cursor: "pointer",
                  marginRight: "-0.4rem"
                }}
                onClick={() => scrollContainer("right")}
                aria-label="Scroll right"
              >
                <FaChevronRight size={18} />
              </button>
            )}
          </div>
          <div className="text-end">
            <span className="fw-bold">
              Consultation Fee :{" "}
              {displayedAmount ? `₹${displayedAmount.toFixed(2)}` : "N/A"}
            </span>
          </div>
          <form>
            <div
              className="row g-2 mt-1"
              style={{
                maxHeight: isMobile ? "none" : "55vh",
                overflowY: isMobile ? "visible" : "auto"
              }}
            >
              {allSlots.length ? (
                allSlots.map((slot, idx) => (
                  <div key={idx} className="col-6 col-sm-4 col-md-2">
                    <button
                      type="button"
                      className={`btn w-100 rounded-pill ${
                        slot.status === "BOOKED"
                          ? "btn-danger"
                          : selectedSlot === slot.full
                          ? "btn-success"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => {
                        if (slot.status === "BOOKED") {
                          customToast({
                            severity: WARNING,
                            summary: "Slot Booked",
                            detail: BOOKING_SLOT_ALREADY_BOOKED,
                            life: 3000
                          });
                        } else {
                          setSelectedSlot(slot.full);
                        }
                      }}
                    >
                      {slot.label}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-muted">No slots available.</div>
              )}
            </div>
            <div className="d-grid mt-3">
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSubmitted || !selectedSlot}
                onClick={handleBooking}
              >
                Book Slot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorSlot;
