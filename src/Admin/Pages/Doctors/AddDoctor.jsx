import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

const AddDoctor = () => {
  const navigate = useNavigate();
   const { customToast } = useToastr();
  const [formData, setFormData] = useState({
    profileImageUrl: "",
    gender: "",
    firstName: "",
    lastName: "",
    presentState: "",
    presentCity: "",
    qualification: "",
    specialization_id: ""
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

  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Map states & cities
  const mappedStates = useMemo(
    () => stateList.map((state) => ({ id: state.stateId, name: state.name })),
    [stateList]
  );

  const mappedCities = useMemo(
    () => cityList.map((city) => ({ id: city.cityId, name: city.name })),
    [cityList]
  );

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get(`/api/states`);
        setStateList(response.data || []);
        setCityList([]);
        setFormData((prev) => ({ ...prev, presentState: "", presentCity: "" }));
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
    fetchStates();
  }, []);

  useEffect(() => {
    const selectedState = stateList.find(
      (state) => state.stateId.toString() === formData.presentState
    );
    if (selectedState?.cities) {
      setCityList(selectedState.cities);
    } else {
      setCityList([]);
    }
    setFormData((prev) => ({ ...prev, presentCity: "" }));
  }, [formData.presentState, stateList]);

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
    }
  ];

  const handleChange = (e, required, label, pastedValue = "") => {
    let { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setImageFile(file);
      setImagePreview(file ? URL.createObjectURL(file) : null);
      return;
    }

    if (pastedValue) value += pastedValue;
    const sanitizedValue = sanitizeInput(value);
    const updatedValue = validatePersonName(sanitizedValue);

    let error = "";
    if (!value && required) error = ERROR_REQUIRED(label);
    if (updatedValue.length > 30) error = ERROR_MAXIMUM_LENGTH(30);

    const specialCharRegex =
      name === "name" || name === "newName"
        ? start_with_char
        : start_with_char_or_number;
    if (value && specialCharRegex.test(value)) error = ERROR_LEADING_OR_TRAILING_SPACE;

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
    else if (!verifyStartingOrEndingCharacters(value)) error = ERROR_LEADING_OR_TRAILING_SPACE;
    else if (verifyDoubleSpace(value)) error = ERROR_DOUBLE_SPACE;
    else if (!validateLength(value, 2, 30)) error =
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
            className={`form-select ${error ? "hasError" : value ? "is-valid" : ""}`}
          >
            <option value="" disabled>{field.placeholder}</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
          {error && (
            <TooltipWrapper tooltipMessage={error}>
              <span style={{ position: "absolute", right: "2.1rem", top: "70%", transform: "translateY(-50%)", cursor: "pointer" }}>
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
    let valid = true;
    let newErrors = {};

    formFields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = ERROR_REQUIRED(field.label);
        valid = false;
      }
    });

    if (!imageFile) {
      newErrors.profileImageUrl = ERROR_REQUIRED("Profile Image");
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      customToast({
        severity: ERROR,
        summary: OPPS_MSG,
        detail: "Please fill all required fields.",
        life: 3000
      });
    }

    return valid;
  };

  // Submit form
  const saveDoctor = async () => {
    if (!validateAllFields()) return;

    const formPayload = new FormData();
    formPayload.append("name", `${formData.firstName} ${formData.lastName}`);
    formPayload.append("gender", formData.gender);
    formPayload.append("stateId", formData.presentState);
    formPayload.append("cityId", formData.presentCity);
    formPayload.append("qualification", formData.qualification);
    formPayload.append("specializationId", formData.specialization_id);

    // Add either image file or image URL
    if (imageFile) {
      formPayload.append("profileImageUrl", imageFile);
    } else if (formData.profileImageUrl) {
      formPayload.append("profileImageUrl", formData.profileImageUrl.trim());
    }
  //  // For debug: log all formData entries
  //   for (const pair of formPayload.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }

    try {
      const res = await api.post("/api/doctor/add-single", formPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status === 200) {
        customToast({
          severity: SUCCESS,
          summary: SUCCESS_MSG,
          detail: "Doctor added successfully.",
          life: 3000
        });
        navigate("/dashboard/doctors");
      }
    } catch (e) {
      customToast({
        severity: ERROR,
        summary: OPPS_ERROR,
        detail: e?.response?.data?.error || "Failed to add doctor",
        life: 4000
      });
    }
  };

  return (
    <div className="my-2">
      <h4 className="text-muted mb-1">Add Doctor</h4>
      <div className="card">
        <div className="card-body p-3">
          <Form>
            {/* Image Upload and Preview */}
            <div className="text-start">
              <input
                type="file"
                accept="image/*"
                id="profileImageInput"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <div
                onClick={() => document.getElementById("profileImageInput").click()}
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
                  <small className="text-danger">{errors.profileImageUrl}</small>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="row g-2">
              {formFields.map((field) => renderField(field))}
            </div>

            {/* Save Button */}
            <div className="text-start mt-3">
              <Button onClick={saveDoctor} className="btn btn-primary">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
