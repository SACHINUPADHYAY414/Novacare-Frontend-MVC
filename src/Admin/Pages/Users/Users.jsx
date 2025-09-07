import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../../../Components/Action/Api";
import { useToastr } from "../../../Components/Toastr/ToastrProvider";
import {
  RiInformation2Line,
  RiEdit2Line,
  RiDeleteBinLine,
  RiSave2Line
} from "react-icons/ri";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CustomInputField from "../../../Components/CustomInput/CustomInputField";
import TooltipWrapper from "../../../Components/Tooltip/TooltipWrapper";
import {
  OPPS_MSG,
  SUCCESS_MSG,
  ERROR,
  NOT_FOUND,
  OPPS_ERROR,
  ENTER_VALID_DATA,
  ERROR_VALIDATE_EMAIL,
  ERROR_MINIMUM_LENGTH,
  ERROR_MAXIMUM_LENGTH,
  ERROR_MUST_LENGTH
} from "../../../Utils/strings";
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizeMobileNumber,
  validateLength,
  verifyEmail
} from "../../../Utils/allValidation";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

// Dummy title mapping function (optional)
const mapTitleToString = (title) => title;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { customToast } = useToastr();
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const roleOptions = [
    { id: "ADMIN", name: "ADMIN" },
    { id: "USER", name: "USER" }
  ];

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data || []);
    } catch (err) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: err.response?.data?.message || NOT_FOUND,
        life: 4000
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) fetchUsers();
  }, [isAuthenticated, token]);

  const handleEdit = (user) => {
    setEditRowId(user.id);
    setEditedData({
      id: user.id,
      title: user.title || "",
      name: user.name || "",
      gender: user.gender || "",
      email: user.email || "",
      password: "", // Optional
      presentAddressLine1: user.address || "",
      presentCity: user.city || "",
      presentState: user.state || "",
      presentPincode: user.pinCode || "",
      mobileNumber: user.mobileNumber || "",
      dateOfBirth: user.dateOfBirth || "",
      role: user.role || ""
    });
  };

  const handleChange = useCallback((name, value) => {
    let sanitizedValue = sanitizeInput(value);
    let error = "";

    switch (name) {
      case "name":
        if (!validateLength(sanitizedValue, 2, 50)) {
          error = sanitizedValue.length < 2 ? ERROR_MINIMUM_LENGTH(2) : ERROR_MAXIMUM_LENGTH(50);
        }
        break;
      case "mobileNumber":
        sanitizedValue = sanitizeMobileNumber(sanitizedValue);
        if (!validateLength(sanitizedValue, 10, 10)) error = ERROR_MUST_LENGTH(10);
        break;
      case "email":
        sanitizedValue = sanitizeEmail(sanitizedValue);
        if (sanitizedValue && !verifyEmail(sanitizedValue)) error = ERROR_VALIDATE_EMAIL;
        break;
      default:
        break;
    }

    setEditedData((prev) => ({ ...prev, [name]: sanitizedValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const handleSave = async () => {
    if (Object.values(errors).some(Boolean)) {
      customToast({ severity: ERROR, summary: OPPS_MSG, detail: ENTER_VALID_DATA, life: 3000 });
      return;
    }

    const payload = {
      title: mapTitleToString(editedData.title),
      name: editedData.name.trim(),
      gender: editedData.gender,
      email: editedData.email,
      password: editedData.password,
      address: editedData.presentAddressLine1,
      city: editedData.presentCity,
      state: editedData.presentState,
      pinCode: editedData.presentPincode,
      mobileNumber: editedData.mobileNumber,
      dateOfBirth: editedData.dateOfBirth,
      role: editedData.role
    };

    try {
      await api.put(`/api/admin/user/${editedData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      customToast({
        severity: "success",
        summary: SUCCESS_MSG,
        detail: "User updated successfully!",
        life: 3000
      });
      fetchUsers();
      setEditRowId(null);
      setErrors({});
    } catch (err) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: err.response?.data?.message || OPPS_ERROR,
        life: 4000
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      customToast({
        severity: "success",
        summary: SUCCESS_MSG,
        detail: "User deleted successfully!",
        life: 3000
      });
      fetchUsers();
    } catch (err) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: err.response?.data?.message || OPPS_ERROR,
        life: 4000
      });
    }
  };

  const renderField = (field, value, error, onChangeHandler) => {
    if (field.type === "select") {
      return (
        <div style={{ position: "relative" }}>
          <select
            className={`form-select form-select-sm ${error ? "is-invalid" : ""}`}
            value={value || ""}
            onChange={(e) => onChangeHandler(field.name, e.target.value)}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((opt) => (
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
                  right: "2px",
                  top: "50%",
                  transform: "translateY(-50%)"
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
        field={field}
        value={value || ""}
        error={error}
        onChange={(e) => onChangeHandler(field.name, e.target.value)}
      />
    );
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="my-2">
      <div className="d-flex justify-content-start align-items-center mb-1 gap-2">
        <h3 className="text-muted mb-0">Users List</h3>
        <Link to="/dashboard/add-user" className="text-primary mt-1 fw-bold text-decoration-none">
          + Add
        </Link>
      </div>

      <div className="w-100">
        <div className="table-responsive rounded">
          <table className="table table-striped table-bordered table-hover text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>S.no</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{indexOfFirstUser + idx + 1}</td>
                  <td>
                    {editRowId === user.id
                      ? renderField({ name: "name", type: "text" }, editedData.name, errors.name, handleChange)
                      : user.name}
                  </td>
                  <td>
                    {editRowId === user.id
                      ? renderField({ name: "email", type: "text" }, editedData.email, errors.email, handleChange)
                      : user.email}
                  </td>
                  <td>
                    {editRowId === user.id
                      ? renderField({ name: "mobileNumber", type: "text" }, editedData.mobileNumber, errors.mobileNumber, handleChange)
                      : user.mobileNumber}
                  </td>
                  <td>
                    {editRowId === user.id
                      ? renderField(
                          {
                            name: "role",
                            type: "select",
                            options: roleOptions,
                            placeholder: "Select Role"
                          },
                          editedData.role,
                          errors.role,
                          handleChange
                        )
                      : user.role}
                  </td>
                  <td>
                    {editRowId === user.id ? (
                      <TooltipWrapper tooltipMessage="Save">
                        <RiSave2Line
                          size={22}
                          className="text-success cursor-pointer me-2"
                          onClick={handleSave}
                        />
                      </TooltipWrapper>
                    ) : (
                      <>
                        <TooltipWrapper tooltipMessage="Edit">
                          <RiEdit2Line
                            size={22}
                            className="text-primary cursor-pointer me-2"
                            onClick={() => handleEdit(user)}
                          />
                        </TooltipWrapper>
                        <TooltipWrapper tooltipMessage="Delete">
                          <RiDeleteBinLine
                            size={22}
                            className="text-danger cursor-pointer"
                            onClick={() => handleDelete(user.id)}
                          />
                        </TooltipWrapper>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center mt-2 gap-3">
          <button
            className="btn btn-light"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <FaChevronLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-light"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
