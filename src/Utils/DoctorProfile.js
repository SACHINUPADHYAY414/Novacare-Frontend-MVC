import images from "./ImagesData";

export const getDoctorProfileImage = (doctor) => {
  const maleImage = images.maleImage;
  const femaleImage = images.femaleImage;
  const otherImage = images.maleImage;
  const loadingImage = images.loaderImage;

  if (!doctor) return loadingImage;

  return (
    doctor.profileImage ||
    doctor.profilePic ||
    (doctor.gender === "Male"
      ? maleImage
      : doctor.gender === "Female"
      ? femaleImage
      : doctor.gender === "Other"
      ? otherImage
      : loadingImage)
  );
};

export const getDoctorQualification = (doctor) => {
  if (!doctor) return "Qualification Not Available";

  return (
    doctor.qualification?.name ||
    doctor.qualification ||
    doctor.qualifications?.name ||
    doctor.qualifications ||
    "Qualification Not Available"
  );
};
