import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedDoctor } from "../../Redux/doctorSlice";
import Ellipses from "../Ellipses/Ellipses";
import { getDoctorProfileImage } from "../../Utils/DoctorProfile";

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
      className="h-100 d-flex flex-column text-decoration-none text-dark border-0 bg-transparent p-0"
      aria-label={`View slots and book appointment for Dr. ${name}`}
    >
      <img
        src={getDoctorProfileImage(doctor)}
        alt={name}
        className="img-fluid"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "220px",
          objectFit: "cover",
          display: "block",
          borderRadius: "0"
        }}
      />

      <div className="card-body pb-0 pt-0 my-1 d-flex flex-column flex-grow-1 overflow-hidden border-top">
        <h6 className="mt-1">{name}</h6>
        <div className="text-center mt-auto">
          <span className="speciality-heading">
            <Ellipses
              text={qualification}
              maxChars={50}
              className="speciality-heading"
            />
          </span>
        </div>
      </div>
    </button>
  );
};

export default DoctorCard;
