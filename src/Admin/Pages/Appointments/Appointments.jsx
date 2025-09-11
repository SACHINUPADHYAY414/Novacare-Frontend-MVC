import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../../../Components/Action/Api";
import { useToastr } from "../../../Components/Toastr/ToastrProvider";
import { useSelector } from "react-redux";
import { FALSE, OPPS_MSG, SERVER_ERROR } from "../../../Utils/strings";
import CustomInputField from "../../../Components/CustomInput/CustomInputField";

const AllAppointments = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [errors] = useState({});
  const { customToast } = useToastr();
  const token = useSelector((state) => state.auth.token);
  const [searchFormData, setSearchFormData] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/api/admin/appointments-details", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    }
    fetchData();
  }, [token]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/api/doctor/all-inclusive");
      setDoctors(response.data || []);
    } catch (e) {
      const errorMessage = e?.response?.data?.message || SERVER_ERROR;
            customToast({
              severity: "error",
              summary: OPPS_MSG,
              detail: errorMessage,
              life: 4000
            });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filterData = data.filter((appointment) => {
    const { name, doctorName, email, dutyDate, status } = appliedFilters;

    const nameMatch = name
      ? appointment.userName?.toLowerCase().includes(name.toLowerCase())
      : true;

    const emailMatch = email
      ? appointment.userEmail?.toLowerCase().includes(email.toLowerCase())
      : true;

    const doctorNameMatch = doctorName
      ? String(appointment.doctorId) === doctorName
      : true;

    const dateMatch = dutyDate
      ? appointment.appointmentDate === dutyDate
      : true;

    const statusMatch = status
      ? status === "true"
        ? appointment.status === "BOOKED"
        : appointment.status === "AVILABLE"
      : true;

    return (
      nameMatch && emailMatch && doctorNameMatch && dateMatch && statusMatch
    );
  });

  const indexOfLastData = currentPage * perPage;
  const indexOfFirstData = indexOfLastData - perPage;
  const currentData = filterData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filterData.length / perPage);

  const formFields = [
    {
      label: "User Name",
      id: "name",
      name: "name",
      type: "text",
      required: FALSE,
      placeholder: "Enter First Name",
      colClass: "col-12 col-md-2"
    },
    {
      label: "Doctor Name",
      id: "doctorName",
      name: "doctorName",
      type: "select",
      options: doctors.map((doc) => ({ id: doc.id, name: doc.name })),
      required: FALSE,
      colClass: "col-12 col-md-2",
      placeholder: "Select"
    },
    {
      label: "Email",
      id: "email",
      name: "email",
      type: "text",
      required: FALSE,
      colClass: "col-12 col-md-2",
      placeholder: "Enter email"
    },
    {
      label: "Appointment Date",
      id: "dutyDate",
      name: "dutyDate",
      type: "date",
      required: FALSE,
      colClass: "col-12 col-md-2",
      placeholder: "Enter email"
    },
    {
      label: "Status",
      id: "status",
      name: "status",
      type: "select",
      options: [
        { id: "true", name: "Avilable" },
        { id: "false", name: "InAvilable" }
      ],
      required: FALSE,
      placeholder: "Select",
      colClass: "col-12 col-md-2"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters(searchFormData);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchFormData({});
    setAppliedFilters({});
    setCurrentPage(1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const renderField = (field) => {
    const { name, type, label, options = [], colClass } = field;
    const value = searchFormData[name] ?? "";
    const error = errors[name];

    if (type === "select") {
      return (
        <div className={colClass} key={name} style={{ position: "relative" }}>
          <label className="form-label required-label">{label}</label>
          <select
            name={name}
            value={value}
            onChange={(e) => handleChange(e)}
            className={`form-select ${
              error ? "hasError" : value ? "is-valid" : ""
            }`}
          >
            <option value="">{field.placeholder}</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <CustomInputField
        key={field.id}
        field={field}
        colClass={colClass}
        value={value}
        error={error}
        onChange={handleChange}
      />
    );
  };

  return (
    <div className="my-2">
      <div className="text-start mb-2">
        <h4 className="text-muted mb-0">Appointments List</h4>
      </div>

      <div className="card rounded mb-2">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            {formFields.map((field) => renderField(field))}

            <div
              className="col-12 col-md-2 mt-4"
              style={{ paddingTop: "0.9rem" }}
            >
              <button
                className="btn btn-primary btn-sm me-2"
                style={{ padding: "0.43rem", marginBottom: "0.2rem" }} onClick={handleSearch}>
                Search
              </button>
                <button
                className="btn btn-danger btn-sm"
                style={{ padding: "0.43rem", marginBottom: "0.2rem" }}onClick={handleClear}>
                Clear
              </button>
            </div>
            </div>
        </div>
      </div>

      <div className="table-responsive rounded">
        <table className="table table-striped table-bordered table-hover text-center mb-0 align-middle text-nowrap">
          <thead className="table-primary">
            <tr>
              <th>S.No</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={8}>No appointments found.</td>
              </tr>
            ) : (
              currentData.map(
                (
                  {
                    appointmentId,
                    userName,
                    userEmail,
                    doctorName,
                    appointmentDate,
                    appointmentTime,
                    status
                  },
                  idx
                ) => (
                  <tr key={appointmentId}>
                    <td>{indexOfFirstData + idx + 1}</td>
                    <td>{userName}</td>
                    <td>{userEmail}</td>
                    <td>{doctorName}</td>
                    <td>{appointmentDate}</td>
                    <td>{appointmentTime}</td>
                    <td>{status}</td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Previous</Tooltip>}
            >
              <span
                role="button"
                tabIndex={0}
                className={`cursor-pointer ${
                  currentPage === 1 ? "text-muted" : "text-primary"
                }`}
                onClick={handlePrev}
              >
                <FaChevronLeft size={20} />
              </span>
            </OverlayTrigger>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <OverlayTrigger placement="top" overlay={<Tooltip>Next</Tooltip>}>
              <span
                role="button"
                tabIndex={0}
                className={`cursor-pointer ${
                  currentPage === totalPages ? "text-muted" : "text-primary"
                }`}
                onClick={handleNext}
              >
                <FaChevronRight size={20} />
              </span>
            </OverlayTrigger>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
