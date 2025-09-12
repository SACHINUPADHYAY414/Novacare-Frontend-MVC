import React from "react";

const UnderLine = () => {
  return (
   <div className="d-flex justify-content-center align-items-center mb-4 gap-2">
          <div
            className="bg-primary"
            style={{ height: "4px", width: "40px", borderRadius: "2px" }}
          ></div>
          <div
            className="bg-danger rounded-circle"
            style={{ height: "10px", width: "10px" }}
          ></div>
          <div
            className="bg-primary"
            style={{ height: "4px", width: "40px", borderRadius: "2px" }}
          ></div>
        </div>
  );
};

export default UnderLine;
