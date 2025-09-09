import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import api from "../../../Components/Action/Api.js";
import { useToastr } from "../../../Components/Toastr/ToastrProvider.jsx";
import TooltipWrapper from "../../../Components/Tooltip/TooltipWrapper.jsx";
import { RiInformation2Line } from "react-icons/ri";
import {
  ERROR_REQUIRED,
  ERROR,
  OPPS_MSG,
  SUCCESS,
  SUCCESS_MSG,
  OPPS_ERROR
} from "../../../Utils/strings.js";

const AddDutyRoster = () => {
  const navigate = useNavigate();
  const { customToast } = useToastr();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    fromDate: "",
    toDate: "",
    fromTime: "",
    toTime: "",
    duration: "",
    isAvailable: false
  });

  const [errors, setErrors] = useState({});
  const [generatedRoster, setGeneratedRoster] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctor/all-inclusive");
        setDoctors(res.data || []);
      } catch (error) {
        customToast({
          severity: "error",
          summary: "Oops!",
          detail: error.response?.data?.message || "Failed to fetch doctors.",
          life: 3000
        });
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const {
      doctorId,
      fromDate,
      toDate,
      fromTime,
      toTime,
      duration,
      isAvailable
    } = formData;

    if (
      doctorId &&
      fromDate &&
      toDate &&
      fromDate <= toDate &&
      fromTime &&
      toTime &&
      duration
    ) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const tempRoster = [];

      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        tempRoster.push({
          doctorId,
          dutyDate: dt.toISOString().split("T")[0],
          fromTime,
          toTime,
          duration,
          isAvailable
        });
      }
      setGeneratedRoster(tempRoster);
    } else {
      setGeneratedRoster([]);
    }
  }, [
    formData.doctorId,
    formData.fromDate,
    formData.toDate,
    formData.fromTime,
    formData.toTime,
    formData.duration,
    formData.isAvailable
  ]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    if (name === "duration") {
      if (/[^0-9]/.test(val)) return;
      if (val.length > 2) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateAllFields = () => {
    let valid = true;
    const newErrors = {};

    const requiredFields = [
      "doctorId",
      "fromDate",
      "toDate",
      "fromTime",
      "toTime",
      "duration"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = ERROR_REQUIRED(
          field === "doctorId"
            ? "Doctor"
            : field.charAt(0).toUpperCase() + field.slice(1)
        );
        valid = false;
      }
    });

    const dur = parseInt(formData.duration);
    if (formData.duration && (isNaN(dur) || dur < 1 || dur > 60)) {
      newErrors.duration = "Duration must be between 1 and 60 minutes";
      valid = false;
    }

    if (
      formData.fromDate &&
      formData.toDate &&
      formData.toDate < formData.fromDate
    ) {
      newErrors.toDate = "To Date must be same or after From Date";
      valid = false;
    }

    if (formData.fromTime && formData.toTime) {
      const fromParts = formData.fromTime.split(":");
      const toParts = formData.toTime.split(":");
      const fromMinutes = parseInt(fromParts[0]) * 60 + parseInt(fromParts[1]);
      const toMinutes = parseInt(toParts[0]) * 60 + parseInt(toParts[1]);
      if (toMinutes <= fromMinutes) {
        newErrors.toTime = "To Time must be later than From Time";
        valid = false;
      }
    }

    setErrors(newErrors);
    if (!valid) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: "Please correct the highlighted errors.",
        life: 3000
      });
    }
    return valid;
  };

  const saveDutyRoster = async () => {
    if (!validateAllFields()) return;

    if (generatedRoster.length === 0) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: "No duty roster data to save.",
        life: 3000
      });
      return;
    }
    const formatTime = (timeStr) => {
      if (timeStr.length === 8) return timeStr;
      if (timeStr.length === 5) return timeStr + ":00";
      return timeStr;
    };

    const payload = generatedRoster
      .filter((item) => item.isAvailable)
      .map((item) => ({
        doctorId: parseInt(item.doctorId),
        duration: parseInt(item.duration),
        dutyDate: item.dutyDate,
        fromTime: formatTime(item.fromTime),
        toTime: formatTime(item.toTime),
        isAvailable: item.isAvailable
      }));

    if (payload.length === 0) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: "No dates marked as available to save.",
        life: 3000
      });
      return;
    }

    try {
      const res = await api.post("/api/duty-roster/add", payload, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.status === 200) {
        customToast({
          severity: SUCCESS,
          summary: SUCCESS_MSG,
          detail: "Duty roster added successfully.",
          life: 3000
        });
        navigate("/dashboard/dutyRoster");
      }
    } catch (e) {
      customToast({
        severity: ERROR,
        summary: OPPS_ERROR,
        detail: e?.response?.data?.error || "Failed to add duty roster",
        life: 4000
      });
    }
  };

  const handleGeneratedRosterChange = (index, field, value) => {
    setGeneratedRoster((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="my-2">
      <h4 className="text-muted mb-1">Add Duty Roster</h4>
      <div className="card mb-3">
        <div className="card-body pb-2">
          <Form>
            <div className="row g-2">
              <div className="col-12 col-md-2" style={{ position: "relative" }}>
                <label htmlFor="doctorId" className="form-label required-label">
                  Doctor
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleFormChange}
                  className={`form-select ${
                    errors.doctorId
                      ? "hasError"
                      : formData.doctorId
                      ? "is-valid"
                      : ""
                  }`}
                >
                  <option value="">Select</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
                {errors.doctorId && (
                  <TooltipWrapper tooltipMessage={errors.doctorId}>
                    <span
                      style={{
                        position: "absolute",
                        right: "2.1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                      }}
                    >
                      <RiInformation2Line color="#ff3d42" />
                    </span>
                  </TooltipWrapper>
                )}
              </div>

              <div className="col-12 col-md-2" style={{ position: "relative" }}>
                <label htmlFor="fromDate" className="form-label required-label">
                  From Date
                </label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleFormChange}
                  className={`form-control ${
                    errors.fromDate
                      ? "hasError"
                      : formData.fromDate
                      ? "is-valid"
                      : ""
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.fromDate && (
                  <TooltipWrapper tooltipMessage={errors.fromDate}>
                    <span
                      style={{
                        position: "absolute",
                        right: "2.1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                      }}
                    >
                      <RiInformation2Line color="#ff3d42" />
                    </span>
                  </TooltipWrapper>
                )}
              </div>

              <div className="col-12 col-md-2" style={{ position: "relative" }}>
                <label htmlFor="toDate" className="form-label required-label">
                  To Date
                </label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleFormChange}
                  className={`form-control ${
                    errors.toDate
                      ? "hasError"
                      : formData.toDate
                      ? "is-valid"
                      : ""
                  }`}
                  min={
                    formData.fromDate || new Date().toISOString().split("T")[0]
                  }
                />
                {errors.toDate && (
                  <TooltipWrapper tooltipMessage={errors.toDate}>
                    <span
                      style={{
                        position: "absolute",
                        right: "2.1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                      }}
                    >
                      <RiInformation2Line color="#ff3d42" />
                    </span>
                  </TooltipWrapper>
                )}
              </div>
              {/* From Time */}
              <div className="col-12 col-md-2" style={{ position: "relative" }}>
                <label htmlFor="fromTime" className="form-label required-label">
                  From Time
                </label>
                <input
                  type="time"
                  id="fromTime"
                  name="fromTime"
                  value={formData.fromTime}
                  onChange={handleFormChange}
                  className={`form-control ${
                    errors.fromTime
                      ? "hasError"
                      : formData.fromTime
                      ? "is-valid"
                      : ""
                  }`}
                />
                {errors.fromTime && (
                  <TooltipWrapper tooltipMessage={errors.fromTime}>
                    <span
                      style={{
                        position: "absolute",
                        right: "2.1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                      }}
                    >
                      <RiInformation2Line color="#ff3d42" />
                    </span>
                  </TooltipWrapper>
                )}
              </div>

              {/* To Time */}
              <div className="col-12 col-md-2" style={{ position: "relative" }}>
                <label htmlFor="toTime" className="form-label required-label">
                  To Time
                </label>
                <input
                  type="time"
                  id="toTime"
                  name="toTime"
                  value={formData.toTime}
                  onChange={handleFormChange}
                  className={`form-control ${
                    errors.toTime
                      ? "hasError"
                      : formData.toTime
                      ? "is-valid"
                      : ""
                  }`}
                />
                {errors.toTime && (
                  <TooltipWrapper tooltipMessage={errors.toTime}>
                    <span
                      style={{
                        position: "absolute",
                        right: "2.1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                      }}
                    >
                      <RiInformation2Line color="#ff3d42" />
                    </span>
                  </TooltipWrapper>
                )}
              </div>

              {/* Duration */}
              <div className="col-12 col-md-2" style={{ position: "relative" }}>
                <label htmlFor="duration" className="form-label required-label">
                  Duration (min)
                </label>
                <input
                  type="tel"
                  id="duration"
                  name="duration"
                  placeholder="Duration"
                  min="1"
                  max="60"
                  value={formData.duration}
                  onChange={handleFormChange}
                  className={`form-control ${
                    errors.duration
                      ? "hasError"
                      : formData.duration
                      ? "is-valid"
                      : ""
                  }`}
                />
                {errors.duration && (
                  <TooltipWrapper tooltipMessage={errors.duration}>
                    <span
                      style={{
                        position: "absolute",
                        right: "2.1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                      }}
                    >
                      <RiInformation2Line color="#ff3d42" />
                    </span>
                  </TooltipWrapper>
                )}
              </div>
            </div>
            {/* Is Available Checkbox */}
            <div className="d-flex align-items-center mt-2 pt-2">
              <Form.Check
                type="checkbox"
                label="Available"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleFormChange}
              />
            </div>
          </Form>
        </div>
      </div>

      {generatedRoster.length > 0 && (
        <div
          className="card"
          style={{
            minHeight: isDesktop ? "20vh" : undefined
          }}
        >
          <div className="card-body p-0">
            <div className="d-flex justify-content-between mt-2 mb-2 mx-3 align-items-center text-nowrap">
              <h5>Duty Roster</h5>
              <Button variant="primary" onClick={saveDutyRoster}>
                Save
              </Button>
            </div>

            <div
              className="table-responsive"
              style={{ maxHeight: "48vh", overflowY: "auto" }}
            >
              <table className="table table-striped table-bordered text-center align-middle text-nowrap">
                <thead
                  className="table-primary"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10
                  }}
                >
                  <tr>
                    <th>Doctor Name</th>
                    <th>Date</th>
                    <th>From Time</th>
                    <th>To Time</th>
                    <th>Duration (min)</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedRoster.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {doctors.find((d) => d.id === parseInt(item.doctorId))
                          ?.name || ""}
                      </td>
                      <td>{item.dutyDate}</td>
                      <td>
                        <input
                          type="time"
                          value={item.fromTime}
                          disabled={!formData.isAvailable || !item.isAvailable}
                          onChange={(e) =>
                            handleGeneratedRosterChange(
                              index,
                              "fromTime",
                              e.target.value
                            )
                          }
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          value={item.toTime}
                          disabled={!formData.isAvailable || !item.isAvailable}
                          onChange={(e) =>
                            handleGeneratedRosterChange(
                              index,
                              "toTime",
                              e.target.value
                            )
                          }
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="tel"
                          min="1"
                          max="60"
                          value={item.duration}
                          disabled={!formData.isAvailable || !item.isAvailable}
                          onChange={(e) =>
                            handleGeneratedRosterChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          className="form-control"
                        />
                      </td>

                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={item.isAvailable}
                          disabled={!formData.isAvailable}
                          onChange={(e) =>
                            handleGeneratedRosterChange(
                              index,
                              "isAvailable",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDutyRoster;
