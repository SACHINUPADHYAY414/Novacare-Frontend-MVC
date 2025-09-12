import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedDoctor } from "../../Redux/doctorSlice";
import Ellipses from "../Ellipses/Ellipses";
import { getDoctorProfileImage } from "../../Utils/DoctorProfile";
import images from "../../Utils/ImagesData";

const DoctorCard = ({ doctor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!doctor) return null;

  const name = doctor.doctorName || doctor.name || "Unnamed Doctor";

  const qualification =
    typeof doctor.specialization === "object"
      ? doctor.specialization?.name
      : doctor.specialization ||
        doctor.qualification?.name ||
        doctor.qualification ||
        doctor.qualifications?.name ||
        doctor.qualifications ||
        "Specialist";

  const handleClick = () => {
    dispatch(setSelectedDoctor(doctor));
    navigate("/doctor-slot");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="h-100 d-flex p-0 flex-column text-decoration-none text-dark border-0 bg-transparent"
      aria-label={`View slots and book appointment for Dr. ${name}`}
    >
      <div
        className="mx-auto d-block doctor-profile-img"
        style={{
          backgroundImage: `url("${images.background3}")`,
          // backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          width: "100%",
          minWidth: "100%",
          height: "auto"
        }}
      >
        <img
          src={getDoctorProfileImage(doctor)}
          alt={`${doctor.doctorName || "Doctor"} profile`}
          className="img-fluid"
          style={{
            width: "100%",
            height: "auto",
            minHeight: "200px",
            objectFit: "cover",
            display: "block",
            backgroundColor: "transparent"
          }}
          onError={(e) => {
            e.target.src = images.defaultDoctorImage;
          }}
        />
      </div>
      <div className="card-body pb-2 pt-0 d-flex flex-column flex-grow-1 overflow-hidden border-top">
        <h6 className="mt-1">
           <Ellipses
              text={name}
              maxChars={20}
              className="speciality-heading"
            />
        </h6>
        <div className="text-center mt-auto">
          <Ellipses
              text={qualification}
              maxChars={20}
              className="speciality-heading"
            />
        </div>
      </div>
    </button>
  );
};

export default DoctorCard;
