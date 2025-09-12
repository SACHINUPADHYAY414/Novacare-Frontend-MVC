import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import api from "../../../Components/Action/Api.js";
import { useToastr } from "../../../Components/Toastr/ToastrProvider.jsx";
import TooltipWrapper from "../../../Components/Tooltip/TooltipWrapper.jsx";
import { RiInformation2Line } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import CustomInputField from "../../../Components/CustomInput/CustomInputField.jsx";

import {
  sanitizeInput,
  validatePersonName,
  validateLength,
  verifyStartingOrEndingCharacters,
  verifyDoubleSpace,
  verifyPasteData,
  start_with_char,
  start_with_char_or_number
} from "../../../Utils/allValidation.js";

import {
  OPPS_MSG,
  SUCCESS_MSG,
  ERROR_REQUIRED,
  ERROR_MAXIMUM_LENGTH,
  ERROR_MINIMUM_LENGTH,
  ERROR_LEADING_OR_TRAILING_SPACE,
  ERROR_DOUBLE_SPACE,
  ERROR_PASTE_DATA,
  ERROR,
  SERVER_ERROR,
  SUCCESS,
  OPPS_ERROR,
  TRUE
} from "../../../Utils/strings.js";
import { confirmDialog } from "../../../Components/ConfirmAction/ConfirmAction.jsx";

const EditDoctor = () => {
  const navigate = useNavigate();
  const { customToast } = useToastr();

  const location = useLocation();
  const doctorId = location.state?.doctorId;
  const MAX_FILE_SIZE_MB = 5;

  const [formData, setFormData] = useState({
    profileImageUrl: "",
    gender: "",
    firstName: "",
    lastName: "",
    presentState: "",
    presentCity: "",
    qualification: "",
    specialization_id: "",
    status: "true" // Store as string for select
  });

  const [errors, setErrors] = useState({});
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [specialties, setSpecialties] = useState([]);

  const genderList = [
    { id: "1", name: "Male" },
    { id: "2", name: "Female" },
    { id: "3", name: "Other" }
  ];

  // Fetch Specialties
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

  const fetchDoctorById = async (id) => {
    try {
      const res = await api.get(`/api/doctor/${id}`);
      const doctor = res.data;

      const nameParts = doctor.name ? doctor.name.trim().split(" ") : [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        profileImageUrl: doctor.profileImageUrl || "",
        gender: doctor.gender || "",
        firstName,
        lastName,
        presentState: doctor.stateId ? doctor.stateId.toString() : "",
        presentCity: doctor.cityId ? doctor.cityId.toString() : "",
        qualification: doctor.qualification || "",
        specialization_id: doctor.specialization?.id
          ? doctor.specialization.id.toString()
          : "",
        status: doctor.status !== undefined ? doctor.status.toString() : "true" // always string
      });

      if (doctor.profileImageUrl) {
        setImagePreview(doctor.profileImageUrl);
      }
    } catch (e) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: e?.response?.data?.message || SERVER_ERROR,
        life: 4000
      });
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchSpecialties();
      await fetchStates();
    };

    loadInitialData();
  }, []);

  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  const fetchStates = async () => {
    try {
      const response = await api.get(`/api/states`);
      setStateList(response.data || []);
      setIsInitialDataLoaded(true);
    } catch (e) {
      setStateList([]);
      setCityList([]);
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: e?.response?.data?.message || SERVER_ERROR,
        life: 4000
      });
    }
  };

  useEffect(() => {
    if (doctorId && isInitialDataLoaded) {
      fetchDoctorById(doctorId);
    }
  }, [doctorId, isInitialDataLoaded]);

  useEffect(() => {
    const selectedState = stateList.find(
      (state) => state.stateId.toString() === formData.presentState
    );

    if (selectedState?.cities) {
      setCityList(selectedState.cities);

      const cityExists = selectedState.cities.some(
        (city) => city.cityId.toString() === formData.presentCity
      );

      if (!cityExists) {
        setFormData((prev) => ({ ...prev, presentCity: "" }));
      }
    } else {
      setCityList([]);
      setFormData((prev) => ({ ...prev, presentCity: "" }));
    }
  }, [formData.presentState, stateList]);

  const mappedStates = useMemo(
    () =>
      stateList.map((state) => ({
        id: state.stateId.toString(),
        name: state.name
      })),
    [stateList]
  );

  const mappedCities = useMemo(
    () =>
      cityList.map((city) => ({ id: city.cityId.toString(), name: city.name })),
    [cityList]
  );

  const formFields = [
    {
      label: "Gender",
      id: "gender",
      name: "gender",
      type: "select",
      options: genderList,
      required: TRUE,
      placeholder: "Select Gender",
      colClass: "col-12 col-md-3"
    },
    {
      label: "First Name",
      id: "firstName",
      name: "firstName",
      type: "text",
      required: TRUE,
      placeholder: "Enter First Name",
      colClass: "col-12 col-md-3"
    },
    {
      label: "Last Name",
      id: "lastName",
      name: "lastName",
      type: "text",
      required: TRUE,
      placeholder: "Enter Last Name",
      colClass: "col-12 col-md-3"
    },
    {
      label: "State",
      id: "presentState",
      name: "presentState",
      type: "select",
      options: mappedStates,
      required: TRUE,
      placeholder: "Select State",
      colClass: "col-12 col-md-3"
    },
    {
      label: "City",
      id: "presentCity",
      name: "presentCity",
      type: "select",
      options: mappedCities,
      required: TRUE,
      placeholder: "Select City",
      colClass: "col-12 col-md-3"
    },
    {
      label: "Qualification",
      id: "qualification",
      name: "qualification",
      type: "text",
      required: TRUE,
      placeholder: "Enter Qualification",
      colClass: "col-12 col-md-3"
    },
    {
      label: "Specialization",
      id: "specialization_id",
      name: "specialization_id",
      type: "select",
      options: specialties,
      required: TRUE,
      placeholder: "Select Specialization",
      colClass: "col-12 col-md-3"
    },
    {
      label: "Status",
      id: "status",
      name: "status",
      type: "select",
      options: [
        { id: "true", name: "Active" },
        { id: "false", name: "Inactive" }
      ],
      required: TRUE,
      placeholder: "Select Status",
      colClass: "col-12 col-md-3"
    }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      customToast({
        severity: "error",
        summary: "Oops!",
        detail: "Only PNG and JPG files are allowed.",
        life: 3000,
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      customToast({
        severity: "error",
        summary: "Oops!",
        detail: `File size should be less than ${MAX_FILE_SIZE_MB} MB.`,
        life: 3000,
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e, required, label, pastedValue = "") => {
    let { name, value, type } = e.target;

    if (pastedValue) value += pastedValue;

    let updatedValue = value;
    if (type !== "select-one") {
      const sanitizedValue = sanitizeInput(value);
      updatedValue = validatePersonName(sanitizedValue);
    }

    let error = "";
    if (!updatedValue && required) error = ERROR_REQUIRED(label);
    if (updatedValue.length > 30) error = ERROR_MAXIMUM_LENGTH(30);

    const specialCharRegex =
      name === "name" || name === "newName"
        ? start_with_char
        : start_with_char_or_number;
    if (updatedValue && specialCharRegex.test(updatedValue))
      error = ERROR_LEADING_OR_TRAILING_SPACE;

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

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

  const handleOnBlur = (e, required, label) => {
    const { name, value } = e.target;
    let error = "";

    if (!value && required) error = ERROR_REQUIRED(label);
    else if (!verifyStartingOrEndingCharacters(value))
      error = ERROR_LEADING_OR_TRAILING_SPACE;
    else if (verifyDoubleSpace(value)) error = ERROR_DOUBLE_SPACE;
    else if (!validateLength(value, 2, 30))
      error =
        value.length < 2 ? ERROR_MINIMUM_LENGTH(2) : ERROR_MAXIMUM_LENGTH(30);

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const renderField = (field) => {
    const { name, type, label, required, options = [], colClass } = field;
    const value = formData[name] ?? "";
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
            <option value="" disabled>
              {field.placeholder}
            </option>
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
        errors={errors}
        formData={formData}
        formHandlers={{ handleChange }}
        onPaste={(e) => onPaste(e, field.required, field.label)}
        value={value}
        onBlur={(e) => handleOnBlur(e, field.required, field.label)}
        error={error}
        onChange={(e) => handleChange(e, field.required, field.label)}
      />
    );
  };

  const validateAllFields = () => {
    let isValid = true;
    const newErrors = {};

    formFields.forEach(({ name, label, required, type }) => {
      const value = formData[name];

      if (!value && required) {
        newErrors[name] = ERROR_REQUIRED(label);
        isValid = false;
      } else if (type === "text") {
        if (!verifyStartingOrEndingCharacters(value))
          newErrors[name] = ERROR_LEADING_OR_TRAILING_SPACE;
        else if (verifyDoubleSpace(value)) newErrors[name] = ERROR_DOUBLE_SPACE;
        else if (!validateLength(value, 2, 30)) {
          newErrors[name] =
            value.length < 2
              ? ERROR_MINIMUM_LENGTH(2)
              : ERROR_MAXIMUM_LENGTH(30);
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: ERROR_REQUIRED("Please fix errors before submitting"),
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
      const formPayload = new FormData();

      if (imageFile) {
        formPayload.append("profileImageUrl", imageFile);
      } else if (formData.profileImageUrl) {
        formPayload.append("profileImageUrl", formData.profileImageUrl.trim());
      }

      formPayload.append("gender", formData.gender);
      formPayload.append("name", `${formData.firstName} ${formData.lastName}`);
      formPayload.append("stateId", formData.presentState);
      formPayload.append("cityId", formData.presentCity);
      formPayload.append("qualification", formData.qualification);
      formPayload.append("specializationId", formData.specialization_id);
      formPayload.append("status", formData.status === "true");
      if (doctorId) {
        await api.put(`/api/doctor/${doctorId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        customToast({
          severity: SUCCESS,
          summary: SUCCESS_MSG,
          detail: "Doctor updated successfully",
          life: 3000
        });
      } else {
        await api.post("/api/doctor", formPayload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        customToast({
          severity: SUCCESS,
          summary: SUCCESS_MSG,
          detail: "Doctor created successfully",
          life: 3000
        });
      }
      navigate("/dashboard/doctors");
    } catch (error) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: error?.response?.data?.message || ERROR,
        life: 3000
      });
    }
  };

  return (
    <div className="my-2">
      <h4 className="text-muted mb-1">Edit Doctor</h4>
      <div className="card">
        <div className="card-body p-3">
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="text-start">
              <input
                type="file"
                accept="image/*"
                id="profileImageInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              <div
                onClick={() =>
                  document.getElementById("profileImageInput").click()
                }
                style={{ cursor: "pointer", display: "inline-block" }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #007bff"
                    }}
                  />
                ) : (
                  <FaUserCircle size={80} color="#007bff" />
                )}
              </div>
              <div>
                <label className="form-label mt-2">Profile Image</label>
                {errors.profileImageUrl && (
                  <small className="text-danger">
                    {errors.profileImageUrl}
                  </small>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="row g-2">
              {formFields.map((field) => renderField(field))}
            </div>

            {/* Save Button */}
            <div className="text-start mt-3">
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditDoctor;
