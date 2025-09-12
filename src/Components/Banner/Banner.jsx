import React from 'react';

const Banner = ({ videoSrc, title = "Health Blogs" }) => {
  return (    
  <div className="banner-wrapper position-relative overflow-hidden">
      {videoSrc && (
        <video
          className="position-absolute top-0 start-0 w-100 h-100"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          style={{ objectFit: "cover", zIndex: 0 }}
        />
      )}

      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 1,
        }}
      ></div>

      <div
        className="position-relative container d-flex text-start align-items-center justify-content-start h-100"
        style={{ zIndex: 2 }}
      ><h3 className="fw-bold text-white fs-4 fs-md-4">{title}</h3>
      </div>
    </div>
  );
};

export default Banner;
