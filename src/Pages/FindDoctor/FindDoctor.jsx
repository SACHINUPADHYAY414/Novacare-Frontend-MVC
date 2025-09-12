import videoData from "../../Utils/VideosUrl";
import Banner from "../../Components/Banner/Banner";
import { useEffect, useState } from "react";
import { useToastr } from "../../Components/Toastr/ToastrProvider";
import api from "../../Components/Action/Api";
import { getDoctorProfileImage } from "../../Utils/DoctorProfile";
import Ellipses from "../../Components/Ellipses/Ellipses";
import Footer from "../../Components/Footer/Footer";
import images from "../../Utils/ImagesData";
import { SERVER_ERROR } from "../../Utils/strings";

const FindDoctor = () => {
  const { customToast } = useToastr();
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/api/doctor/all");
      setDoctors(response.data || []);
    } catch (error) {
      customToast({
        severity: "error",
        summary: "Oops!",
        detail: error.response?.data?.message || SERVER_ERROR,
        life: 3000
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const DoctorCard = ({ doctor }) => {
    const [isHovered, setIsHovered] = useState(false);

    if (!doctor) return null;

    const matchedDoctor = doctors.find(
      (d) => d.id === doctor?.id || d.id === doctor?.doctorId
    );

    return (
      <div
        className="card image-card text-center p-3 pb-0 d-flex flex-column"
        style={{
          height: "160px",
          boxShadow: isHovered ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          transform: isHovered ? "translateY(-5px)" : "translateY(0)"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="rounded-circle mx-auto d-block"
          style={{
            width: "80px",
            height: "80px",
            marginTop: "-60px",
            borderRadius: "50%",
            backgroundImage: `url("${images.background3}")`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden"
          }}
        >
          <img
            src={getDoctorProfileImage(matchedDoctor)}
            alt={`${doctor.doctorName || "Doctor"} profile`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
              transform: "scale(1.15)",
              backgroundColor: "transparent",
              display: "block"
            }}
            onError={(e) => {
              e.target.src = images.defaultDoctorImage;
            }}
          />
        </div>

        <div className="card-body d-flex flex-column flex-grow-1 text-nowrap">
          <div className="text-center fw-semibold">
            <Ellipses text={doctor.name} maxChars={50} className="text-muted" />
          </div>
          <div className="text-center">
            <Ellipses
              text={doctor.specializationName}
              maxChars={50}
              className="text-muted"
            />
          </div>

          {/* ✅ Push this button to bottom */}
          <div className="mt-auto mx-auto pt-2">
            <button className="btn btn-danger btn-sm w-100">
              View Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @media (min-width: 992px) {
          .col-lg-5ths {
            flex: 0 0 15%;
            max-width: 15%;
          }
        }
      `}</style>

      <div>
        <Banner videoSrc={videoData.DnaBackground} title="Find a Doctor" />

        <div className="container px-3 px-md-4 py-4">
          <h2 className="fw-bold fs-5 fs-md-4 fs-lg-3 mb-2 lh-sm">
            Best Specialists & Oncologists in Delhi NCR, India
          </h2>

          <div>
            <p className="fs-6 fs-md-5">
              With a team of the <strong>best oncologists in India</strong>,{" "}
              <strong>Novacare</strong> leads the fight against cancer. We offer{" "}
              <span className="text-primary">20+ cancer sub-specialties</span>,
              over <span className="text-primary">100 top consultants</span>,
              <span className="text-primary">150 resident doctors</span>, and{" "}
              <span className="text-primary">650+ support staff</span>. Each
              year, we care for{" "}
              <span className="text-primary">
                100,000+ Indian and international patients
              </span>{" "}
              with cutting-edge technology and compassion.
            </p>

            <p className="fs-6 fs-md-5">
              Cancer journeys can be emotionally and physically challenging. Our
              specialists use
              <strong> evidence-based, multi-modal treatment </strong>{" "}
              approaches to support a safe and effective recovery from blood,
              brain, cervical, liver, lung, pancreatic, pediatric, prostate,
              oral, throat, and other cancers. Our care is personalized to
              maximize both lifespan and quality of life.
            </p>

            <p className="fs-6 fs-md-5">
              At Novacare, we introduced the concept of
              <a href="#" className="text-decoration-none text-primary">
                {" "}
                Comprehensive Cancer Care{" "}
              </a>
              , providing all diagnostic and treatment services under one roof.
              Our top oncologists in Delhi have trained at some of the most
              prestigious medical institutions globally and built their careers
              helping patients overcome cancer.
            </p>

            <p className="fs-6 fs-md-5">
              From diagnosis to recovery, our specialists work closely with
              patients and their families to create individualized treatment
              plans. Constantly updated with the latest oncology breakthroughs,
              our doctors are committed to giving you the best chance at
              recovery and renewed life.
            </p>
          </div>

          <div className="row gx-3 gy-5 py-5">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 pt-2"
              >
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FindDoctor;
