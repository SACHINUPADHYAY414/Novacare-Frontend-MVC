import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../Components/Action/Api";
import { FaArrowUpWideShort, FaArrowDownWideShort } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Tooltip, Whisper } from "rsuite";
import { useDispatch } from "react-redux";
import { setUppcomingAppointment } from "../../Redux/appointmentSlice";

function Appointments() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  const [sortOrder, setSortOrder] = useState("desc");

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      dispatch(setUppcomingAppointment(null));
      window.loadingStop?.();
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await api.get(`/api/appointments/user/${user.id}`);
        setAppointments(response.data);

        const today = new Date();
        const futureAppointments = response.data.filter(
          (appt) => new Date(appt.appointmentDate) >= today
        );

        if (futureAppointments.length > 0) {
          const nextAppt = futureAppointments.sort(
            (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
          )[0];
          dispatch(setUppcomingAppointment(nextAppt));
        } else {
          dispatch(setUppcomingAppointment(null));
        }
      } catch (e) {
        console.log(e?.message);
        dispatch(setUppcomingAppointment(null));
      }
    };

    fetchAppointments();
  }, [user, isAuthenticated, dispatch]);
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = sortedAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const totalPages = Math.ceil(sortedAppointments.length / appointmentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleSortOrder = (order) => {
    if (sortOrder !== order) {
      setSortOrder(order);
      setCurrentPage(1);
    }
  };

  return (
    <div className="container my-2">
      <h3 className="fs-4 fs-md-3 fs-lg-2 text-center text-md-start">
        All Appointments
      </h3>
      <div className="table-responsive">
        <table className="table table-bordered table-striped mt-2 text-center text-nowrap">
          <thead className="table-primary">
            <tr>
              <th>S.No</th>
              <th>Doctors</th>
              <th>
                Appointment Date{" "}
                <Whisper
                  placement="top"
                  trigger="hover"
                  speaker={<Tooltip>Sort Ascending</Tooltip>}
                >
                  <span>
                    <FaArrowUpWideShort
                      style={{
                        cursor: "pointer",
                        marginLeft: 8,
                        color: sortOrder === "asc" ? "yellow" : "white"
                      }}
                      onClick={() => toggleSortOrder("asc")}
                      size={16}
                    />
                  </span>
                </Whisper>
                <Whisper
                  placement="top"
                  trigger="hover"
                  speaker={<Tooltip>Sort Descending</Tooltip>}
                >
                  <span>
                    <FaArrowDownWideShort
                      style={{
                        cursor: "pointer",
                        marginLeft: 4,
                        color: sortOrder === "desc" ? "yellow" : "white"
                      }}
                      onClick={() => toggleSortOrder("desc")}
                      size={16}
                    />
                  </span>
                </Whisper>
              </th>
              <th>Appointment Time</th>
              <th>Status</th>
            </tr>
          </thead>
          {/* {JSON.stringify(currentAppointments)} */}
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appt, index) => (
                <tr key={appt.id}>
                  <td>{indexOfFirstAppointment + index + 1}</td>
                  <td>{appt.doctorName || "N/A"}</td>
                  <td>{appt.appointmentDate}</td>
                  <td>{appt.appointmentTime}</td>
                  <td>{appt.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {currentAppointments.length > 0 && (
        <nav>
          <ul className="pagination pagination-sm justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <Whisper
                placement="top"
                trigger="hover"
                speaker={<Tooltip>Previous Page</Tooltip>}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  style={{ outline: "none", boxShadow: "none" }}
                >
                  <FaChevronLeft />
                </button>
              </Whisper>
            </li>

            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx + 1}
                className={`page-item ${
                  currentPage === idx + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <Whisper
                placement="top"
                trigger="hover"
                speaker={<Tooltip>Next Page</Tooltip>}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  style={{ outline: "none", boxShadow: "none" }}
                >
                  <FaChevronRight />
                </button>
              </Whisper>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Appointments;
