import React from "react";
import videoData from "../../Utils/VideosUrl";

const blogs = [
  {
    id: 1,
    title: "Joint Pain (Arthralgia): Common Causes and Treatment Options",
    description:
      "Joint pain, medically known as 'arthralgia', can manifest in...",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_Joint_Pain_Arthralgia_a6b612c32e.jpg"
  },
  {
    id: 2,
    title: "World Suicide Prevention Day 2025: Creating Hope Through Action",
    description:
      "Suicide is a topic many people avoid speaking about, often...",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_Suicide_b5a25c92d3.jpg"
  },
  {
    id: 3,
    title: "Deviated Nasal Septum: When Does It Need Surgery?",
    description:
      "Breathing freely is something most of us take for granted, ...",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_Deviated_Nasal_Septum_2fe6d85c6c.jpg"
  },
  {
    title:
      "Living with Lymphoma: Diagnosis, Treatment, and Hope Through Immunotherapy",
    description:
      "Lymphoma is a type of blood cancer that develops in the lymphatic system, which plays a crucial role in the body’s..",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_Living_with_Lymphoma_3805a711b2.jpg"
  },
  {
    title: " Swollen Feet Explained: Common Causes and Home Remedies",
    description:
      "Swollen feet can make even simple tasks like walking or standing uncomfortable. Sometimes, the swelling develops ...",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_Swollen_Feet_Explained_f59a2c0fdd.jpg"
  },
  {
    title: "What is Bronchopneumonia? Symptoms, Causes, and Treatment Options?",
    description:
      "Bronchopneumonia is a lung infection that can make breathing difficult and cause considerable discomfort It...",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_What_is_Bronchopneumonia_b4aca41bd2.jpg"
  },
  {
    title: "Oesophageal Cancer: Causes, Symptoms, and Treatment Options",
    description:
      "Oesophageal cancer is a type of cancer that affects the food pipe (oesophagus). Though a serious concern, it often goes ...",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_Oesophageal_Cancer_31856e1b13.jpg"
  },
  {
    title:
      "World Alzheimer's Day 2025: Key Facts on Alzheimer's Disease, Symptoms, Causes & Stages",
    description:
      "Alzheimer’s disease is a progressive brain disorder that affects memory, thinking, and behaviour. It is the most ...",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_World_Alzheimer_s_Day_190a697c9d.webp"
  },
  {
    title: "Weight Loss Drugs Effect on Heart: Risks & Safer Approaches",
    description:
      "In recent years, weight loss drugs have gained significant attention worldwide. With rising rates of obesity, diabetes, It...",
    image:
      "https://max-website20-images.s3.ap-south-1.amazonaws.com/medium_Weight_Loss_Drug_Trends_173f128b45.jpg"
  }
];

const HealthBlogs = () => {
  return (
    <div>
      <div
        className="position-relative overflow-hidden"
        style={{ height: "100px" }}
      >
        {/* Video Background */}
        <video
          className="position-absolute top-0 start-0 w-100 h-100"
          src={videoData.DnaBackground}
          autoPlay
          loop
          muted
          playsInline
          style={{ objectFit: "cover", zIndex: 0 }}
        />
        <div
          className="position-relative d-flex align-items-center justify-content-center h-100"
          style={{ zIndex: 1 }}
        >
          <h3 className="fw-bold text-white text-center">Health Blogs</h3>
        </div>
      </div>

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
    </div>
  );
};

export default HealthBlogs;
