import React, { useState } from "react";
// import bgVideo from "/assets/Videos/Dna.mp4";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import CustomInputField from "../../Components/CustomInput/CustomInputField.jsx";
import {
  ERROR_REQUIRED,
  ERROR_VALIDATE_EMAIL,
  ERROR_DOUBLE_SPACE,
  ERROR_LEADING_OR_TRAILING_SPACE,
  SUCCESS,
  SUCCESS_MSG,
  SERVER_ERROR,
  OPPS_MSG,
  TRUE
} from "../../Utils/strings.js";
import {
  sanitizeInput,
  sanitizeEmail,
  verifyEmail,
  verifyDoubleSpace,
  verifyStartingOrEndingCharacters
} from "../../Utils/allValidation.js";
import api from "../../Components/Action/Api.js";
import { useToastr } from "../../Components/Toastr/ToastrProvider.jsx";
import videoData from "../../Utils/VideosUrl.js";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const { customToast } = useToastr();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState({});

  const fields = [
    {
      id: "name",
      name: "name",
      label: "Full Name",
      placeholder: "Enter your name",
      type: "text",
      required: TRUE
    },
    {
      id: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
      required: TRUE
    },
    {
      id: "message",
      name: "message",
      label: "Message",
      placeholder: "Write your message",
      type: "textarea",
      required: TRUE
    }
  ];

  const handleChange = (e, label) => {
    const { name, value } = e.target;
    const sanitized = sanitizeInput(value);
    const updatedValue =
      name === "email" ? sanitizeEmail(sanitized) : sanitized;
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({
      ...prev,
      [name]: !value ? ERROR_REQUIRED(label) : ""
    }));
  };

  const handleOnBlur = (e, label) => {
    const { name, value } = e.target;
    let error = "";

    if (!value) error = ERROR_REQUIRED(label);
    else if (!verifyStartingOrEndingCharacters(value))
      error = ERROR_LEADING_OR_TRAILING_SPACE;
    else if (verifyDoubleSpace(value)) error = ERROR_DOUBLE_SPACE;

    if (name === "email" && value && !verifyEmail(value))
      error = ERROR_VALIDATE_EMAIL;
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};

    fields.forEach(({ name, label, required }) => {
      const value = formData[name];
      if (required && !value) tempErrors[name] = ERROR_REQUIRED(label);
      if (name === "email" && value && !verifyEmail(value))
        tempErrors[name] = ERROR_VALIDATE_EMAIL;
    });

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    try {
      setLoading(true);
      window?.loadingStart();
      const response = await api.post("/api/contact-us", formData);

      customToast({
        severity: SUCCESS,
        summary: SUCCESS_MSG,
        detail:
          response?.data?.message || "Your message has been sent successfully!",
        life: 3000
      });
      setFormData({ name: "", email: "", message: "" });
      navigate("/");
    } catch (error) {
      customToast({
        severity: "error",
        summary: OPPS_MSG,
        detail: error.response?.data?.message || error.message || SERVER_ERROR,
        life: 3000
      });
    } finally {
      setLoading(false);
      window?.loadingEnd();
    }
  };

  const renderInput = (field) => (
    <CustomInputField
      key={field.id}
      type={field.type}
      field={field}
      value={formData[field.name] || ""}
      placeholder={field.placeholder}
      onChange={(e) => handleChange(e, field.label)}
      onBlur={(e) => handleOnBlur(e, field.label)}
      error={errors[field.name] || ""}
    />
  );

  return (
    <div className="text-white position-relative contact-section-wrapper">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover bg-video"
        style={{ zIndex: 0 }}
      >
        <source src={videoData.DnaBackground} type="video/mp4" />
      </video>

      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 50, 80, 0.6)", zIndex: 1 }}
      ></div>

      <Container
        className="d-flex justify-content-center mx-auto align-items-center"
        style={{ position: "relative", zIndex: 2, height: "100%" }}
      >
        <Row
          className="w-100 align-items-center flex-column flex-sm-row"
          style={{ height: "100%" }}
        >
          <Col xs={12} md={8} sm={6} className="text-center text-sm-start px-4 py-3">
            <h1 className="fw-bold text-white mt-3 mt-sm-4 fs-3 fs-sm-2 fs-md-1 lh-sm">
              Get in Touch with Us
            </h1>

            <p className="text-light mb-4 fs-6 fs-sm-5">
              We are here to provide you the best healthcare support. Reach out
              for appointments, emergencies, or just to say hello.
            </p>

            <div className="mt-3">
              <p className="mb-2 fs-6">
                <FaPhoneAlt className="me-2 text-warning" /> +91 7294890821
              </p>
              <p className="mb-2 fs-6">
                <FaEnvelope className="me-2 text-warning" />{" "}
                support@novacare.com
              </p>
              <p className="fs-6">
                <FaMapMarkerAlt className="me-2 text-warning" /> 123, Green
                Avenue, New Delhi
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            md={4}
            sm={6}
            className="d-flex justify-content-center align-items-center px-3 py-3"
          >
            <div className="card shadow-lg w-100 contact-form-card">
              <div className="card-body">
                <h2 className="text-center mb- text-primary fw-bold fs-4 fs-sm-3 fs-md-2">
                  Contact Us
                </h2>

                <p className="text-muted text-center mb-4">
                  Fill out the form and our team will get back to you shortly.
                </p>

                <form onSubmit={handleSubmit}>
                  {fields.map(renderInput)}
                  <div className="d-grid mt-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
