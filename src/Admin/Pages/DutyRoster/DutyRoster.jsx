import { useEffect, useState } from "react";
import { useToastr } from "../../../Components/Toastr/ToastrProvider";
import api from "../../../Components/Action/Api";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FALSE, OPPS_MSG } from "../../../Utils/strings";
import CustomInputField from "../../../Components/CustomInput/CustomInputField";
import { RiInformation2Line } from "react-icons/ri";
import TooltipWrapper from "../../../Components/Tooltip/TooltipWrapper";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  calculateDuration,
  convertTimeToMinutes
} from "../../../Utils/timeFormater";
import { RiEdit2Line, RiSave2Line, RiCloseLine } from "react-icons/ri";

const DutyRoster = () => {
  const { customToast } = useToastr();
  const [doctors, setDoctors] = useState([]);
  const [dutyRosters, setDutyRosters] = useState([]);
  const getCurrentDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [searchFormData, setSearchFormData] = useState({
    duty_date: getCurrentDateString()
  });

  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [formData] = useState({});
  const [errors] = useState({});
  const doctorsPerPage = 10;

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/api/doctor/all");
      setDoctors(response.data || []);
    } catch (error) {
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: error.response?.data?.message || "Failed to fetch doctors.",
        life: 3000
      });
    }
  };

  const fetchDutyRosters = async () => {
    try {
      const res = await api.get("/api/duty-roster/all");
      const rawRosters = res.data || [];
      const mappedRosters = rawRosters.map((duty) => {
        const doctor = doctors.find((doc) => doc.id === duty.doctorId);
        return {
          ...duty,
          doctor_name: doctor ? doctor.name : "N/A"
        };
      });
      setDutyRosters(mappedRosters);
    } catch (e) {
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: e?.response?.data?.message || "Failed to fetch duty rosters",
        life: 4000
      });
      setDutyRosters([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDutyRosters();
      handleSearch()
    }
  }, [doctors]);

  useEffect(() => {
    setAppliedFilters({ duty_date: getCurrentDateString() });
  }, []);

  const handleEditClick = (duty) => {
    setEditingId(duty.id);
    setEditFormData({
      doctorId: duty.doctorId || "",
      dutyDate: duty.dutyDate || "",
      fromTime: duty.fromTime || "",
      toTime: duty.toTime || "",
      isAvailable: duty.isAvailable ? "true" : "false",
      duration: duty.duration || 0,
      status: duty.status || ""
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...editFormData, [name]: value };

    if (name === "fromTime" || name === "toTime") {
      updatedData.duration = calculateDuration(
        updatedData.fromTime,
        updatedData.toTime
      );
    }
    setEditFormData(updatedData);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (id) => {
    try {
      const payload = {
        doctorId: editFormData.doctorId,
        dutyDate: editFormData.dutyDate,
        fromTime: editFormData.fromTime,
        toTime: editFormData.toTime,
        isAvailable: editFormData.isAvailable === "true",
        duration: editFormData.duration,
        status: editFormData.status
      };

      await api.put(`/api/duty-roster/update/${id}`, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      await fetchDutyRosters();
      setDutyRosters((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                ...payload,
                doctor_name:
                  doctors.find((doc) => doc.id === payload.doctorId)?.name ||
                  "N/A"
              }
            : d
        )
      );

      customToast({
        severity: "success",
        summary: "Success",
        detail: "Duty roster updated successfully",
        life: 3000
      });
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: error.response?.data?.message || "Failed to update duty roster",
        life: 3000
      });
    }
  };

  const filteredDutyRosters = dutyRosters.filter((duty) => {
    const { duty_date, is_available, doctor_id, fromTime, toTime, status } =
      appliedFilters;

    // Date exact match or no filter
    const dutyDateMatch = duty_date ? duty.dutyDate === duty_date : true;

    // Availability as string match or no filter
    const availabilityMatch = is_available
      ? String(duty.isAvailable) === is_available
      : true;

    // Doctor id as string match or no filter
    const doctorMatch = doctor_id ? String(duty.doctorId) === doctor_id : true;

    // Status case-insensitive trimmed match or no filter
    const statusMatch = status
      ? duty.status?.trim().toUpperCase() === status.trim().toUpperCase()
      : true;

    // Time filters (converted to minutes)
    const dutyFromMinutes = convertTimeToMinutes(duty.fromTime);
    const dutyToMinutes = convertTimeToMinutes(duty.toTime);

    const filterFromMinutes = fromTime ? convertTimeToMinutes(fromTime) : null;
    const filterToMinutes = toTime ? convertTimeToMinutes(toTime) : null;

    const fromTimeMatch =
      filterFromMinutes !== null ? dutyFromMinutes >= filterFromMinutes : true;

    const toTimeMatch =
      filterToMinutes !== null ? dutyToMinutes <= filterToMinutes : true;

    return (
      dutyDateMatch &&
      availabilityMatch &&
      doctorMatch &&
      fromTimeMatch &&
      toTimeMatch &&
      statusMatch
    );
  });

  // Sorting
  const multiColumnSort = (data, sortConfig) => {
    if (sortConfig.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const { key, direction } of sortConfig) {
        let aVal = a[key];
        let bVal = b[key];

        if (key === "doctor_name") {
          aVal = aVal?.toLowerCase() || "";
          bVal = bVal?.toLowerCase() || "";
        } else if (key === "dutyDate") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        } else if (key === "duration") {
          aVal = Number(aVal);
          bVal = Number(bVal);
        } else if (key === "isAvailable") {
          aVal = aVal ? 1 : 0;
          bVal = bVal ? 1 : 0;
        }

        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedDutyRosters = multiColumnSort(filteredDutyRosters, sortConfig);

  // Pagination logic
  const totalDutyPages = Math.ceil(sortedDutyRosters.length / doctorsPerPage);
  const indexOfLastDuty = currentPage * doctorsPerPage;
  const indexOfFirstDuty = indexOfLastDuty - doctorsPerPage;
  const currentDuties = sortedDutyRosters.slice(
    indexOfFirstDuty,
    indexOfLastDuty
  );

  // Sorting UI helpers
  const toggleSort = (primaryKey) => {
    setSortConfig((prevConfig) => {
      const existing = prevConfig.find((c) => c.key === primaryKey);
      let newDirection = "asc";

      if (existing) {
        newDirection = existing.direction === "asc" ? "desc" : "asc";
      }

      const secondaryKeys = [
        "doctor_name",
        "dutyDate",
        "isAvailable",
        "duration"
      ];

      // Ensure primary key is first
      const newConfig = [
        { key: primaryKey, direction: newDirection },
        ...secondaryKeys
          .filter((k) => k !== primaryKey)
          .map((k) => {
            // Keep previous direction if already sorted
            const existingSort = prevConfig.find((s) => s.key === k);
            return {
              key: k,
              direction: existingSort?.direction || "asc"
            };
          })
      ];

      return newConfig;
    });
  };

  const renderSortIcon = (key) => {
    const colSort = sortConfig.find((c) => c.key === key);

    if (!colSort) {
      return <FaChevronUp style={{ opacity: 0.3 }} />;
    }

    const style = { color: "green" };
    if (colSort.direction === "asc") return <FaChevronUp style={style} />;
    if (colSort.direction === "desc") return <FaChevronDown style={style} />;

    return null;
  };

  const formFields = [
    {
      label: "Doctor",
      id: "doctor_id",
      name: "doctor_id",
      type: "select",
      options: doctors.map((d) => ({ id: String(d.id), name: d.name })),
      required: FALSE,
      placeholder: "Select",
      colClass: "col-12 col-md-2"
    },
    {
      label: "Duty Date",
      id: "duty_date",
      name: "duty_date",
      type: "date",
      required: FALSE,
      placeholder: "Select Duty Date",
      colClass: "col-12 col-md-2"
    },
    {
      label: "From Time",
      id: "fromTime",
      name: "fromTime",
      type: "time",
      required: FALSE,
      colClass: "col-12 col-md-2"
    },
    {
      label: "To Time",
      id: "toTime",
      name: "toTime",
      type: "time",
      required: FALSE,
      colClass: "col-12 col-md-2"
    },
    {
      label: "Is Available",
      id: "is_available",
      name: "is_available",
      type: "select",
      options: [
        { id: "true", name: "Available" },
        { id: "false", name: "Unavailable" }
      ],
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
        { id: "Active", name: "Active" },
        { id: "InActive", name: "InActive" }
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

  const renderTableRows = () => {
    if (currentDuties.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center text-muted">
            No data found
          </td>
        </tr>
      );
    }

    return currentDuties.map((duty, index) => {
      const serialNumber = (currentPage - 1) * doctorsPerPage + index + 1;

      if (editingId === duty.id) {
        return (
          <tr key={duty.id}>
            <td>{serialNumber}</td>
            <td>
              <select
                name="doctorId"
                value={editFormData.doctorId}
                onChange={handleEditChange}
                className={`form-control ${
                  errors.doctorId ? "is-invalid" : ""
                }`}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <div className="invalid-feedback">{errors.doctorId}</div>
              )}
            </td>
            <td>
              <input
                type="date"
                name="dutyDate"
                value={editFormData.dutyDate}
                onChange={handleEditChange}
                className={`form-control ${
                  errors.dutyDate ? "is-invalid" : ""
                }`}
              />
              {errors.dutyDate && (
                <div className="invalid-feedback">{errors.dutyDate}</div>
              )}
            </td>
            <td>
              <input
                type="time"
                name="fromTime"
                value={editFormData.fromTime}
                onChange={handleEditChange}
                className={`form-control ${
                  errors.fromTime ? "is-invalid" : ""
                }`}
              />
              {errors.fromTime && (
                <div className="invalid-feedback">{errors.fromTime}</div>
              )}
            </td>
            <td>
              <input
                type="time"
                name="toTime"
                value={editFormData.toTime}
                onChange={handleEditChange}
                className={`form-control ${errors.toTime ? "is-invalid" : ""}`}
              />
              {errors.toTime && (
                <div className="invalid-feedback">{errors.toTime}</div>
              )}
            </td>
            <td>{editFormData.duration}</td>
            <td>
              <select
                name="isAvailable"
                value={editFormData.isAvailable}
                onChange={handleEditChange}
                className={`form-control ${
                  errors.isAvailable ? "is-invalid" : ""
                }`}
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
              {errors.isAvailable && (
                <div className="invalid-feedback">{errors.isAvailable}</div>
              )}
            </td>
            <td>
              <select
                name="status"
                value={editFormData.status}
                onChange={handleEditChange}
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
              >
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
              {errors.status && (
                <div className="invalid-feedback">{errors.status}</div>
              )}
            </td>
            <td>
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <RiSave2Line
                  size={22}
                  className="text-primary cursor-pointer"
                  onClick={() => handleSaveEdit(duty.id)}
                />
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <RiCloseLine
                  size={24}
                  className="text-danger cursor-pointer"
                  onClick={handleCancelEdit}
                />
              </OverlayTrigger>
            </td>
          </tr>
        );
      }

      return (
        <tr key={duty.id}>
          <td>{serialNumber}</td>
          <td>{duty.doctor_name || "N/A"}</td>
          <td>{duty.dutyDate}</td>
          <td>{duty.fromTime}</td>
          <td>{duty.toTime}</td>
          <td>{duty.duration}</td>
          <td>{duty.isAvailable ? "Available" : "Unavailable"}</td>
          <td>{duty.status || "N/A"}</td>

          <td>
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <RiEdit2Line
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => handleEditClick(duty)}
              >
                Edit
              </RiEdit2Line>
            </OverlayTrigger>
          </td>
        </tr>
      );
    });
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
            onChange={handleChange}
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
        onChange={handleChange}
      />
    );
  };

  return (
    <div className="my-2">
      <div className="d-flex justify-content-start align-items-center mb-2 gap-2">
        <h4 className="text-muted mb-0">DutyRoster List</h4>
        <Link
          to="/dashboard/add-duty-roster"
          className="text-primary mt-1 fw-bold text-decoration-none"
        >
          + Add
        </Link>
      </div>

      <div className="card rounded mb-2">
        <div className="card-body">
          <div className="row g-2">
            {formFields.map((field) => renderField(field))}

            <div className="col-12 col-md-2 d-flex align-items-end gap-2">
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
              <button className="btn btn-danger" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive rounded">
        <table className="table table-striped table-bordered text-center align-middle text-nowrap">
          <thead className="table-primary">
            <tr>
              <th>S.No</th>
              <th role="button" onClick={() => toggleSort("doctor_name")}>
                Doctor Name {renderSortIcon("doctor_name")}
              </th>
              <th role="button" onClick={() => toggleSort("dutyDate")}>
                Duty Date {renderSortIcon("dutyDate")}
              </th>
              <th>From Time</th>
              <th>To Time</th>
              <th role="button" onClick={() => toggleSort("duration")}>
                Duration (Min) {renderSortIcon("duration")}
              </th>
              <th role="button" onClick={() => toggleSort("isAvailable")}>
                Is Available {renderSortIcon("isAvailable")}
              </th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>

        {totalDutyPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
            <OverlayTrigger placement="top" overlay={<Tooltip>Next</Tooltip>}>
              <FaChevronLeft
                size={20}
                className={`cursor-pointer ${
                  currentPage === 1 ? "text-muted" : "text-primary"
                }`}
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
              />
            </OverlayTrigger>

            <span>
              Page {currentPage} of {totalDutyPages}
            </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>Next</Tooltip>}>
              <FaChevronRight
                size={20}
                className={`cursor-pointer ${
                  currentPage === totalDutyPages ? "text-muted" : "text-primary"
                }`}
                onClick={() =>
                  currentPage < totalDutyPages &&
                  setCurrentPage(currentPage + 1)
                }
              />
            </OverlayTrigger>
          </div>
        )}
      </div>
    </div>
  );
};

export default DutyRoster;
