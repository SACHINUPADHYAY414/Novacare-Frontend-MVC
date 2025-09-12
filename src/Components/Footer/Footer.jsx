import React, { useState } from "react";
import { Link } from "react-router-dom";
import { COMPANY_NAME } from "../../Utils/strings";
import images from "../../Utils/ImagesData";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSubscribed(true);
        setError("");
      } else {
        setError("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setError(error?.message);
    }
  };

  return (
    <div>
      <div className="w-100 h-100 bg-white">
        {/* About Section */}
        <div className="w-100" style={{ backgroundColor: "#b11016" }}>
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center px-3 py-3 text-white">
            <h3 className="fw-semibold fs-4 mb-3 mb-md-0">
              About <span className="fw-semibold fs-3">{COMPANY_NAME}</span>
            </h3>
            <div
              className="bg-secondary mx-3 d-none d-md-block"
              style={{ width: "2px", height: "100px" }}
            ></div>

            <p className="mb-0 flex-grow-1">
              <span className="fw-bold">{COMPANY_NAME}</span> is today counted
              amongst Asia’s premier exclusive cancer centres that offer unique
              advantage of cutting edge technology,
              <br />
              put to use by renowned super specialists. This potent combination
              of man and machine ensures world-class cancer care to not only
              patients from India, but also from the <br />
              neighboring SAARC countries and others.
            </p>
          </div>
        </div>

        {/* Contact & Newsletter Section */}
        <div className="container d-flex flex-column flex-md-row justify-content-center align-items-start px-3 py-4 gap-4">
          {/* Noida Location 1 */}
          <div className="text-center text-md-start flex-fill">
            <p className="mb-2 small">
              Plot No. A-123, Sector 62, Noida,
              <br />
              Uttar Pradesh - 201301, India |{" "}
              <a href="tel:+91-120-1234567" className="text-primary">
                +91-120-1234567
              </a>
            </p>
            <b>OPD Timings:</b>{" "}
            <span className="small">
              09:00 am to 05:00 pm (All weekdays except Sunday and Holiday)
            </span>
            <br />
            <b>Emergency Services:</b>{" "}
            <span className="small">24x7 All weekdays</span>
          </div>

          {/* Divider */}
          <div
            className="bg-secondary d-none d-md-block mx-3"
            style={{ width: "1px", height: "80px" }}
          ></div>

          {/* Noida Location 2 */}
          <div className="text-center text-md-start flex-fill">
            <p className="mb-2 small">
              C-45, Sector 2, Noida,
              <br />
              Uttar Pradesh - 201301, India |{" "}
              <a href="tel:+91-120-7654321" className="text-primary">
                +91-120-7654321
              </a>
            </p>
            <b>OPD Timings:</b>{" "}
            <span className="small">
              09:00 am to 05:00 pm (All weekdays except Sunday and Holiday)
            </span>
            <br />
            <b>Emergency Services:</b>{" "}
            <span className="small">24x7 All weekdays</span>
          </div>

          {/* Divider */}
          <div
            className="bg-secondary d-none d-md-block mx-3"
            style={{ width: "1px", height: "80px" }}
          ></div>

          {/* Newsletter */}
          <div
            className="text-center text-md-start justify-content-center align-items-center flex-fill"
            style={{ minWidth: "280px" }}
          >
            <form onSubmit={handleSubmit}>
              <b className="text-primary">
                Subscribe Today For Our Healthy Tips Newsletter
              </b>
              <div className="d-flex flex-column flex-sm-row mt-3 gap-2 gap-sm-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <button type="submit" className="btn btn-danger flex-shrink-0">
                  Subscribe
                </button>
              </div>
            </form>

            {error && (
              <div className="subscribe-error-pop mt-2">
                <p className="text-danger small">{error}</p>
              </div>
            )}

            {subscribed && (
              <div className="subscribe-success-pop mt-2" id="subscribePop">
                <p className="text-success small">
                  Your subscription was successful! Kindly check your mailbox
                  and confirm your subscription. If you don't see the email
                  within a few minutes, check the spam/junk folder.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer
        className="text-white pt-5"
        style={{ backgroundColor: "#095c90" }}
      >
        <div className="container px-4">
          <div className="row text-center text-md-start">
            {/* Column 1 */}
            <div className="col-12 col-md-3 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3 border-bottom border-3 border-danger pb-1 d-inline-block">
                About {COMPANY_NAME}
              </h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/about-us" className="text-white text-decoration-none">
                    About {COMPANY_NAME}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Historyand Milestones"
                    className="text-white text-decoration-none"
                  >
                    History and Milestones
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Awards & Recognitions"
                    className="text-white text-decoration-none"
                  >
                    Awards & Recognitions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Accreditations"
                    className="text-white text-decoration-none"
                  >
                    Accreditations
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="col-12 col-md-3 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3 border-bottom border-3 border-danger pb-1 d-inline-block">
                About {COMPANY_NAME}
              </h5>
              <ul className="list-unstyled">
                <li>
                  <Link
                    to="/Preventive Health Program"
                    className="text-white text-decoration-none"
                  >
                    Preventive Health Program
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Connecting with the Larger
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Extending a Hand
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Flying a dream
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col-12 col-md-3 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3 border-bottom border-3 border-danger pb-1 d-inline-block">
                Insights
              </h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Latest News
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Conferences
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Newsletters
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="col-12 col-md-3">
              <h5 className="fw-bold mb-3 border-bottom border-3 border-danger pb-1 d-inline-block">
                About {COMPANY_NAME}
              </h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Refund & Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    Corporate Compliance
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white text-decoration-none">
                    EWS Services/Bed Status – {COMPANY_NAME}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer image divider */}
        <div className="d-flex align-items-center justify-content-center my-3 px-3">
          <div
            style={{ flex: 1, height: "1px", backgroundColor: "white" }}
          ></div>

          <img
            src={images.footerImage}
            alt="Footer Image"
            style={{ maxHeight: "100px", margin: "0 15px" }}
          />

          <div
            style={{ flex: 1, height: "1px", backgroundColor: "white" }}
          ></div>
        </div>

        {/* Navigation Links */}
        <ul className="nav justify-content-center flex-wrap mb-3 px-3">
          {[
            { label: "Home", href: "/" },
            {
              label: "Privacy Policy",
              href: "/privacy-policy/"
            },
            {label: `${COMPANY_NAME} Newsletter`,
              href: "/newsletter/"
            },
            { label: "Sitemap", href: "/sitemap" },
            { label: "Contact Us", href: "/contact-us" }
          ].map(({ label, href }, i) => (
            <React.Fragment key={label}>
              {i !== 0 && (
                <li className="nav-item mx-2 d-none d-sm-block">
                  <span
                    className="bg-danger rounded-circle d-inline-block"
                    style={{ width: "8px", height: "8px", marginTop: "14px" }}
                  ></span>
                </li>
              )}
              <li className="nav-item">
                <a className="nav-link text-white px-2" href={href}>
                  {label}
                </a>
              </li>
            </React.Fragment>
          ))}
        </ul>

        <div className="text-white py-3" style={{ backgroundColor: "#022f4c" }}>
          <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center px-3">
            <p className="mb-0 text-center text-sm-start small">
              All © reserved to {COMPANY_NAME}
            </p>
            <span className="text-center text-sm-end mt-2 mt-sm-0 small">
              Design By :{" "}
              <a
                href="https://portfoliosachinkumar.vercel.app"
                className="link-primary text-white ms-1 text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sachin Upadhyay
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
