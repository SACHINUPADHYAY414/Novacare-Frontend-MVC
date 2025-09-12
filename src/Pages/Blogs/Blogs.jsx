import React from "react";
import Banner from "../../Components/Banner/Banner";
import videoData from "../../Utils/VideosUrl";
import Footer from "../../Components/Footer/Footer";
import {blogs} from "../../Utils/ImagesData";

const HealthBlogs = () => {
  return (
    <div>
      <Banner videoSrc={videoData.DnaBackground} title="Health Blogs" />
      <div className="container">
        <div
          className="mt-4 mb-3 d-flex justify-content-center gap-3 align-items-center p-sm-3 px-1 rounded"
          style={{ backgroundColor: "#003a70" }}
        >
          <h4 className="text-white">To Book an Appointment</h4>
        </div>

        <div className="row">
          {blogs.map((blog, index) => (
            <div className="col-md-4 mb-4" key={blog.id || index}>
              <div className="card h-100">
                <img
                  src={blog.image}
                  className="card-img-top"
                  alt={blog.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title fw-bold">{blog.title}</h6>
                  <p className="card-text text-muted small">
                    {blog.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HealthBlogs;
