import React, { useEffect, useState } from "react";
import { useToastr } from "../../../Components/Toastr/ToastrProvider";
import api from "../../../Components/Action/Api";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FALSE,
  NOT_FOUND,
  OPPS_MSG,
  SERVER_ERROR
} from "../../../Utils/strings";
import CustomInputField from "../../../Components/CustomInput/CustomInputField";
import { RiInformation2Line } from "react-icons/ri";
import TooltipWrapper from "../../../Components/Tooltip/TooltipWrapper";
import {
  RiEdit2Line,
  RiDeleteBinLine,
  RiSave2Line,
  RiCloseLine
} from "react-icons/ri";

const Doctors = () => {
  const { customToast } = useToastr();
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [specialties, setSpecialties] = useState([]);
  const [searchFormData, setSearchFormData] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  const doctorsPerPage = 10;

  const [formData] = useState({});
  const [errors] = useState({});

  const navigate = useNavigate();

  const fetchSpecialties = async () => {
    try {
      const res = await api.get("/api/specialization/all");
      setSpecialties(res.data || []);
    } catch (e) {
      setSpecialties([]);
      const errorMessage = e?.response?.data?.message || SERVER_ERROR;
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: errorMessage,
        life: 4000
      });
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/api/doctor/all-inclusive");
      setDoctors(response.data || []);
    } catch (error) {
      customToast({
        severity: "error",
        summary: "Oops!",
        detail: error.response?.data?.message || "Failed to fetch doctors.",
        life: 3000
      });
    }
  };

  useEffect(() => {
    fetchSpecialties();
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await api.delete(`/api/doctor/delete/${id}`);
      customToast({
        severity: "success",
        summary: "Deleted",
        detail: `Doctor deleted successfully.`,
        life: 3000
      });
      fetchDoctors();
    } catch (error) {
      customToast({
        severity: "error",
        summary: "Delete Failed",
        detail: error.response?.data?.message || "Failed to delete doctor.",
        life: 3000
      });
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const { name, qualification, specialization_id, status } = appliedFilters;

    const nameMatch = name
      ? doc.name?.toLowerCase().includes(name.toLowerCase())
      : true;

    const qualificationMatch = qualification
      ? doc.qualification?.toLowerCase().includes(qualification.toLowerCase())
      : true;

    const specializationMatch = specialization_id
      ? String(doc.specialization?.id) === specialization_id
      : true;

    const statusMatch = status
      ? status === "active"
        ? doc.status === true
        : doc.status === false
      : true;

    return (
      nameMatch && qualificationMatch && specializationMatch && statusMatch
    );
  });

  // PAGINATION logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const formFields = [
    {
      label: "Name",
      id: "name",
      name: "name",
      type: "text",
      required: FALSE,
      placeholder: "Enter First Name",
      colClass: "col-12 col-md-2"
    },
    {
      label: "Qualification",
      id: "qualification",
      name: "qualification",
      type: "text",
      required: FALSE,
      placeholder: "Enter Qualification",
      colClass: "col-12 col-md-2"
    },
    {
      label: "Specialization",
      id: "specialization_id",
      name: "specialization_id",
      type: "select",
      options: specialties,
      required: FALSE,
      placeholder: "Select",
      colClass: "col-12 col-md-2"
    },
    {
      label: "Status",
      id: "status",
      name: "status",
      type: "select",
      options: [
        { id: "active", name: "Active" },
        { id: "inactive", name: "Inactive" }
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

  const renderField = (field) => {
    const { name, type, label, required, options = [], colClass } = field;
    const value = searchFormData[name] ?? "";
    const error = errors[name];

    if (type === "select") {
      return (
        <div className={colClass} key={name} style={{ position: "relative" }}>
          <label className="form-label required-label">{label}</label>
          <select
            name={name}
            value={value}
            onChange={(e) => handleChange(e, required, label)}
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
          {error && (
            <TooltipWrapper tooltipMessage={error}>
              <span
                style={{
                  position: "absolute",
                  right: "2.1rem",
                  top: "70%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                <RiInformation2Line color="#ff3d42" />
              </span>
            </TooltipWrapper>
          )}
        </div>
      );
    }

    return (
      <CustomInputField
        key={field.id}
        field={field}
        colClass={colClass}
        formData={formData}
        formHandlers={{ handleChange }}
        value={value}
        error={error}
        onChange={(e) => handleChange(e, required, label)}
      />
    );
  };

  return (
    <div className="my-2">
      <div className="d-flex justify-content-start align-items-center mb-2 gap-2">
        <h4 className="text-muted mb-0">Doctors List</h4>
        <Link
          to="/dashboard/add-doctor"
          className="text-primary mt-1 fw-bold text-decoration-none"
        >
          + Add
        </Link>
      </div>

      {/* Search Form */}
      <div className="card rounded mb-2">
        <div className="card-body">
          <div className="row g-2">
            {formFields.map((field) => renderField(field))}

            <div
              className="col-12 col-md-2 mt-4"
              style={{ paddingTop: "0.9rem" }}
            >
              <button
                className="btn btn-primary btn-sm me-2"
                style={{ padding: "0.43rem", marginBottom: "0.2rem" }}
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                className="btn btn-danger btn-sm"
                style={{ padding: "0.43rem", marginBottom: "0.2rem" }}
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="table-responsive rounded">
        <table className="table table-striped table-bordered table-hover text-center mb-0 align-middle text-nowrap">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Qualification</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.length > 0 ? (
              currentDoctors.map((doc, idx) => (
                <tr key={doc.id}>
                  <td>{indexOfFirstDoctor + idx + 1}</td>
                  <td>{doc.name}</td>
                  <td>
                    {doc.specialization?.name || doc.specializationName || "-"}
                  </td>
                  <td>{doc.qualification || "-"}</td>
                  <td>
                    {doc.status ? (
                      <span className="text-success">Active</span>
                    ) : (
                      <span className="text-danger">Inactive</span>
                    )}
                  </td>
                  <td className="d-flex justify-content-center gap-2">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit</Tooltip>}
                    >
                      <RiEdit2Line
                        size={22}
                        className="text-primary cursor-pointer"
                        onClick={() =>
                          navigate("/dashboard/edit-doctor", {
                            state: { doctor: doc, doctorId: doc.id }
                          })
                        }
                      />
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete</Tooltip>}
                    >
                      <RiDeleteBinLine
                        size={22}
                        className="text-danger cursor-pointer"
                        onClick={() => handleDelete(doc.id)}
                      />
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No doctors found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 gap-1">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Previous</Tooltip>}
            >
              <FaChevronLeft
                size={20}
                className={`cursor-pointer ${
                  currentPage === 1 ? "text-muted" : "text-primary"
                }`}
                onClick={handlePrev}
              />
            </OverlayTrigger>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>Next</Tooltip>}>
              <FaChevronRight
                size={20}
                className={`cursor-pointer ${
                  currentPage === totalPages ? "text-muted" : "text-primary"
                }`}
                onClick={handleNext}
              />
            </OverlayTrigger>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
