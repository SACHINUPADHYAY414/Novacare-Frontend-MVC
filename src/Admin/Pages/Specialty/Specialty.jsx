import React, { useEffect, useState } from "react";
import api from "../../../Components/Action/Api";
import { useToastr } from "../../../Components/Toastr/ToastrProvider";
import {
  RiEdit2Line,
  RiDeleteBinLine,
  RiSave2Line,
  RiCloseLine
} from "react-icons/ri";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CustomInputField from "../../../Components/CustomInput/CustomInputField";
import {
  NOT_FOUND,
  OPPS_MSG,
  SUCCESS_MSG,
  ERROR,
  OPPS_ERROR,
  ENTER_VALID_DATA,
  ERROR_REQUIRED,
  ERROR_LEADING_OR_TRAILING_SPACE,
  ERROR_MAXIMUM_LENGTH,
  ERROR_DOUBLE_SPACE,
  ERROR_MINIMUM_LENGTH,
  ERROR_PASTE_DATA
} from "../../../Utils/strings";
import {
  sanitizeInput,
  start_with_char,
  start_with_char_or_number,
  validateLength,
  validatePersonName,
  verifyDoubleSpace,
  verifyPasteData,
  verifyStartingOrEndingCharacters
} from "../../../Utils/allValidation";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { confirmDialog } from "../../../Components/ConfirmAction/ConfirmAction";

const Specialty = () => {
  const [specialties, setSpecialties] = useState([]);
  const [formData, setFormData] = useState({ name: "", newName: "" });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addingNew, setAddingNew] = useState(false);
  const [searchSpecializationId, setSearchSpecializationId] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});

  const perPage = 10;
  const { customToast } = useToastr();

  const fetchSpecialties = async () => {
    try {
      const res = await api.get("/api/specialization/all");
      setSpecialties(res.data || []);
    } catch (e) {
      setSpecialties([]);
      const errorMessage = e?.response?.data?.message || NOT_FOUND;
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: errorMessage,
        life: 4000
      });
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Handle input changes for both edit and add
  const handleChange = (e, required, label, pastedValue) => {
    let { name, value } = e.target;
    if (pastedValue) value = value + pastedValue;

    let sanitizedValue = sanitizeInput(value);
    let updatedValue = validatePersonName(sanitizedValue);
    let error = "";

    if (updatedValue.length > 30) error = ERROR_MAXIMUM_LENGTH(30);
    if (!value && required) error = ERROR_REQUIRED(label);

    const specialCharRegex =
      name === "name" || name === "newName"
        ? start_with_char
        : start_with_char_or_number;

    if (value && specialCharRegex.test(value)) {
      error = ERROR_LEADING_OR_TRAILING_SPACE;
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle paste event for validations
  const onPaste = (e, required, label) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.clipboardData.getData("Text");
    const result = verifyPasteData(value);

    if (!result.valid) {
      setErrors((prev) => ({ ...prev, [name]: ERROR_PASTE_DATA }));
      return;
    }

    handleChange(e, required, label, value);
  };

  // Validate input on blur
  const handleOnBlur = (e, required, label) => {
    let { name, value } = e.target;
    let error = "";
    let updatedValue = value;

    if (value) {
      if (name === "name" || name === "newName") {
        updatedValue = value.replace(start_with_char, "").trim();
      }

      if (!verifyStartingOrEndingCharacters(updatedValue)) {
        error = ERROR_LEADING_OR_TRAILING_SPACE;
      } else if (verifyDoubleSpace(value)) {
        error = ERROR_DOUBLE_SPACE;
      }

      if (!validateLength(value, 2, 30)) {
        error =
          value.length < 2 ? ERROR_MINIMUM_LENGTH(2) : ERROR_MAXIMUM_LENGTH(30);
      }
    }

    if (!value && required) {
      error = ERROR_REQUIRED(label);
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Save edit
  const handleSave = async () => {
    const name = formData.name.trim();
    if (errors.name || !name) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: ENTER_VALID_DATA,
        life: 3000
      });
      return;
    }

    try {
      setLoadingId(editId);
      await api.put(`/api/specialization/update/${editId}`, { name });
      setSpecialties((prev) =>
        prev.map((spec) => (spec.id === editId ? { ...spec, name } : spec))
      );
      setEditId(null);
      setFormData({ ...formData, name: "" });
      setErrors({});
      await fetchSpecialties();
      customToast({
        severity: "success",
        summary: SUCCESS_MSG,
        detail: "Specialization updated successfully!",
        life: 3000
      });
    } catch (e) {
      const errorMessage = e?.response?.data?.message || OPPS_ERROR;
      await fetchSpecialties();
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: errorMessage,
        life: 4000
      });
    } finally {
      setLoadingId(null);
    }
  };

  // Delete specialization
  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: "Are you sure you want to Delete?",
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "Cancel",
      confirmButtonClass: "btn btn-primary"
    });

    if (!confirmed) return;
    try {
      setLoadingId(id);
      await api.delete(`/api/specialization/${id}`);

      await fetchSpecialties();
      setCurrentPage(1);
      if (appliedFilters.specialization_id === String(id)) {
        setAppliedFilters({});
        setSearchSpecializationId("");
      }

      customToast({
        severity: "success",
        summary: SUCCESS_MSG,
        detail: "Specialization deleted successfully!",
        life: 3000
      });
    } catch (e) {
      const errorMessage = e?.response?.data?.message || OPPS_ERROR;
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: errorMessage,
        life: 4000
      });
    } finally {
      setLoadingId(null);
    }
  };

  // Save new specialization
  const handleSaveNew = async () => {
    const name = formData.newName.trim();
    if (errors.newName || !name) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: ENTER_VALID_DATA,
        life: 3000
      });
      return;
    }
    const confirmed = await confirmDialog({
      title: "Are you sure you want to save changes?",
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
      confirmButtonClass: "btn btn-primary"
    });

    if (!confirmed) return;
    try {
      setLoadingId("new");
      await api.post("/api/specialization/add", { name });
      await fetchSpecialties();
      setAddingNew(false);
      setFormData({ ...formData, newName: "" });
      setErrors({});
      customToast({
        severity: "success",
        summary: SUCCESS_MSG,
        detail: "Specialization added successfully!",
        life: 3000
      });
    } catch (e) {
      const errorMessage = e?.response?.data?.message || OPPS_ERROR;
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: errorMessage,
        life: 4000
      });
    } finally {
      setLoadingId(null);
    }
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditId(null);
    setFormData({ ...formData, name: "" });
    setErrors({});
  };

  // Cancel add new mode
  const handleCancelNew = () => {
    setAddingNew(false);
    setFormData({ ...formData, newName: "" });
    setErrors({});
  };

  // Handle search filter apply
  const handleSearch = () => {
    setAppliedFilters({
      specialization_id: searchSpecializationId || undefined
    });
    setCurrentPage(1);
  };

  // Handle clearing filters
  const handleClear = () => {
    setSearchSpecializationId("");
    setAppliedFilters({});
    setCurrentPage(1);
  };

  // Filter specialties based on applied filters
  const filteredSpecialties = specialties.filter((spec) => {
    if (appliedFilters.specialization_id) {
      return String(spec.id) === appliedFilters.specialization_id;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSpecialties.length / perPage);
  const currentSpecialties = filteredSpecialties.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const colClass = "col-12";
  const field = {
    id: "name",
    name: editId ? "name" : "newName",
    label: "Specialization",
    required: true,
    type: "text",
    placeholder: "Enter Specialization"
  };

  return (
    <div className="my-2">
      <div className="d-flex justify-content-start align-items-center mb-2 gap-2">
        <h4 className="text-muted mb-0">Specialty List</h4>
        {!addingNew && (
          <span
            className="text-primary mt-1 fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => setAddingNew(true)}
          >
            + Add
          </span>
        )}
      </div>

      {/* Search card */}
      <div className="card rounded mb-2">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3">
              <label htmlFor="Specialization" className="form-label">
                Specialty
              </label>
              <select
                className="form-select"
                value={searchSpecializationId}
                onChange={(e) => setSearchSpecializationId(e.target.value)}
              >
                <option value="">Select</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>{" "}
            <div
              className="text- col-12 col-md-2 mt-4"
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
                className="btn btn-danger"
                style={{ padding: "0.43rem", marginBottom: "0.2rem" }}
                onClick={handleClear}
              >
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
              <th>Specialty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addingNew && (
              <tr>
                <td>#</td>
                <td>
                  <CustomInputField
                    key={field.id}
                    field={field}
                    colClass={colClass}
                    hideLabel={true}
                    errors={errors}
                    formData={formData}
                    formHandlers={{ handleChange }}
                    onPaste={(e) => onPaste(e, field.required, field.label)}
                    value={formData?.[field.name] || ""}
                    onBlur={(e) => handleOnBlur(e, field.required, field.label)}
                    error={errors?.[field.name] ?? ""}
                    onChange={(e) =>
                      handleChange(e, field.required, field.label)
                    }
                  />
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Save</Tooltip>}
                    >
                      <RiSave2Line
                        size={22}
                        className={`cursor-pointer ${
                          loadingId === "new" ? "text-muted" : "text-success"
                        }`}
                        onClick={loadingId === "new" ? null : handleSaveNew}
                      />
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Cancel</Tooltip>}
                    >
                      <RiCloseLine
                        size={22}
                        className="cursor-pointer text-secondary"
                        onClick={handleCancelNew}
                      />
                    </OverlayTrigger>
                  </div>
                </td>
              </tr>
            )}

            {currentSpecialties.length === 0 && !addingNew ? (
              <tr>
                <td colSpan={3}>No specializations found.</td>
              </tr>
            ) : (
              currentSpecialties.map((spec, idx) => {
                const isEditing = editId === spec.id;
                const field = {
                  id: "name",
                  name: "name",
                  label: "Specialization",
                  required: true,
                  type: "text",
                  placeholder: "Enter Specialization"
                };
                return (
                  <tr key={spec.id}>
                    <td>{(currentPage - 1) * perPage + idx + 1}</td>
                    <td>
                      {isEditing ? (
                        <CustomInputField
                          key={field.id}
                          field={field}
                          colClass={colClass}
                          errors={errors}
                          formData={formData}
                          formHandlers={{ handleChange }}
                          hideLabel={true}
                          onPaste={(e) =>
                            onPaste(e, field.required, field.label)
                          }
                          value={formData?.[field.name] || ""}
                          onBlur={(e) =>
                            handleOnBlur(e, field.required, field.label)
                          }
                          error={errors?.[field.name] ?? ""}
                          onChange={(e) =>
                            handleChange(e, field.required, field.label)
                          }
                        />
                      ) : (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setEditId(spec.id);
                            setFormData({ ...formData, name: spec.name });
                            setErrors({});
                          }}
                        >
                          {spec.name || "-"}
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="d-flex justify-content-center gap-2">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Save</Tooltip>}
                          >
                            <RiSave2Line
                              size={22}
                              className={`cursor-pointer ${
                                loadingId === spec.id
                                  ? "text-muted"
                                  : "text-success"
                              }`}
                              onClick={
                                loadingId === spec.id ? null : handleSave
                              }
                            />
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Cancel</Tooltip>}
                          >
                            <RiCloseLine
                              size={22}
                              className="cursor-pointer text-secondary"
                              onClick={handleCancel}
                            />
                          </OverlayTrigger>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center gap-2">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Edit</Tooltip>}
                          >
                            <RiEdit2Line
                              size={22}
                              className="text-primary cursor-pointer"
                              onClick={() => {
                                setEditId(spec.id);
                                setFormData({ ...formData, name: spec.name });
                                setErrors({});
                              }}
                            />
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Delete</Tooltip>}
                          >
                            <RiDeleteBinLine
                              size={22}
                              className={`cursor-pointer ${
                                loadingId === spec.id
                                  ? "text-muted"
                                  : "text-danger"
                              }`}
                              onClick={() =>
                                loadingId === spec.id
                                  ? null
                                  : handleDelete(spec.id)
                              }
                            />
                          </OverlayTrigger>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
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
              Page {currentPage} of {totalPages}
            </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>Next</Tooltip>}>
              <FaChevronRight
                size={20}
                className={`cursor-pointer ${
                  currentPage === totalPages ? "text-muted" : "text-primary"
                }`}
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
              />
            </OverlayTrigger>
          </div>
        )}
      </div>
    </div>
  );
};

export default Specialty;
