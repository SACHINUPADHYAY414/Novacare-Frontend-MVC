import React from "react";
import { useNavigate } from "react-router-dom";
import videoData from "../../Utils/VideosUrl";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="text-white text-center position-relative d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "81vh", overflow: "hidden" }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ objectFit: "cover", zIndex: 0 }}
        aria-hidden="true"
      >
        <source src={videoData.DnaBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Foreground Content */}
      <div className="position-relative" style={{ zIndex: 1 }}>
        <h1 className="display-4 mb-4 fw-bold">404 - Page Not Found</h1>
        <p className="lead mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>

        <button
          className="btn btn-outline-light btn-lg"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
