import { useState, useRef } from "react";
import {
  FaSyringe,
  FaRadiation,
  FaPills,
  FaChild,
  FaAngleRight
} from "react-icons/fa";
import { COMPANY_NAME } from "../../Utils/strings";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import UnderLine from "../../Components/UnderLine/UnderLine";
import images from "../../Utils/ImagesData";

const ClinicalService = () => {
  const [currentServiceId, setCurrentServiceId] = useState(1);

  const handleServiceClick = (id) => {
    setCurrentServiceId(id);
  };

  const clinicalService = [
    {
      id: 1,
      icon: <FaSyringe size={30} />,
      para: "Surgical Oncology Service"
    },
    {
      id: 2,
      icon: <FaRadiation size={30} />,
      para: "Radiation Oncology Service"
    },
    {
      id: 3,
      icon: <FaPills size={30} />,
      para: "Medical Oncology Service"
    },
    {
      id: 4,
      icon: <FaChild size={30} />,
      para: "Pediatric Hematology and Oncology Services"
    }
  ];

  const mainImage = [
    {
      id: 1,
      imageSrc: images.surgicalOncology,
      title: "Surgical Oncology Services",
      description:
        "The Best Surgical Oncologist in India can provide unique surgical expertise in surgical cases unfamiliar to general surgeons. The Surgical Oncology Department aims at the following:",
      icon: <FaAngleRight />,
      para1:
        "Cure or Palliate and improve quality of life emphasizing on multimodal treatment",
      para2: "Practice evidence based medicine.",
      link: "/about-rgcirc/"
    },
    {
      id: 2,
      imageSrc: images.radiationOncology,
      title: "Radiation Oncology Service",
      description: `${COMPANY_NAME}, New Delhi, with its tradition of quality and excellence offers comprehensive Cancer treatment with the most advanced techniques of radiotherapy for all Cancer patients.`,
      para1:
        "The department is equipped with Linear Accelerators, Simulators, Dedicated Treatment Planning Computers and Mould Rooms to fabricate immobilization devices and customized lead shields in house.",
      para2: "",
      link: "/clinical-services/radiation-oncology-services/"
    },
    {
      id: 3,
      imageSrc: images.medicalOncology,
      title: "Medical Oncology Services",
      description:
        "A highly qualified, experienced and dedicated team of medical oncologists is available at Rajiv Gandhi Cancer Institute & Research Centre. The team is subgrouped according to the area of specialization as per disease of different organ systems. Evidence based, internationally approved Chemotherapy guidelines are followed for treatment of various solid and hematological malignancies.",
      para1: "",
      para2: "",
      link: "/clinical-services/medical-oncology-services/"
    },
    {
      id: 4,
      imageSrc: images.pediatricOncology,
      title: "Pediatric Hematology and Oncology Services",
      description:
        "Cancer is more common in adults and older people. Around 5% of all cancers occur in children. Childhood cancers are entirely different from their adult counterparts. Childhood cancers are more often curable and children can become long term survivors growing up to be adults with normal life span.",
      para1: "",
      para2: "",
      link: "/clinical-services/pediatric-hematology-and-oncology-services/"
    }
  ];

  const otherServices = [
    {
      image: images.interventionalGastro,
      name: "Interventional Gestroentrology services",
      para: "Department of Gastroenterology as a super-speciality involves management of patients suffering",
      href: "/clinical-services/interventional-gestroentrology-services/"
    },
    {
      image: images.nuclearMedicine,
      name: "Nuclear Medicine Services",
      para: "The department of Nuclear Medicine provides state-of-the-art diagnostic and radionuclides therapeutic",
      href: "/clinical-services/nuclear-medicine-services/"
    },
    {
      image: images.labTransfusion,
      name: "Laboratory Transfusion Services",
      para: "The {COMPANY_NAME} is North India’s premier comprehensive",
      href: "/clinical-services/laboratory-and-transfusion-services/"
    },
    {
      image: images.supportServices,
      name: "Clinical Support Services",
      para: "Several other clinical services are required to treat co-morbidity and non-cancer related elements The {COMPANY_NAME}.",
      href: "/clinical-services/clinical-support-services/"
    },
    {
      image: images.internalMedicine,
      name: "Internal Medicine, Endocrinology",
      para: "Internal medicine is the foundation on which all the medical super specialties are built",
      href: "/clinical-services/internal-medicine-endocrinology-rheumatology-and-infectious-diseases-services/"
    },
    {
      image: images.palliativeCare,
      name: "Supportive Care",
      para: "At {COMPANY_NAME}, a robust “Pain and Palliative Care services” are integrated with oncology care ever since its inception It is estimated.",
      href: "/clinical-services/supportive-care/"
    },
    {
      image: images.preventiveOncology,
      name: "Preventive Oncology Services",
      para: "Cancer is one of the Leading causes of death in India. It is estimated that there are nearly 2.72 million",
      href: "/clinical-services/preventive-oncology-services/"
    },
    {
      image: images.respiratoryMedicine,
      name: "Respiratory Medicine Interventional",
      para: "The Department of Respiratory Medicine and Interventional Pulmonology caters to the entire diagnostic",
      href: "/clinical-services/respiratory-medicine-and-interventional-pulmonology-services/"
    },
    {
      image: images.radiology,
      name: "Radiology Interventional Oncology",
      para: "Radiology Department is a well equipped department with state-of-the-art technology which compares",
      href: "/clinical-services/radiology-and-interventional-oncology-services/"
    },
    {
      image: images.interventionalGastro2,
      name: "Interventional Gestroentrology services",
      para: "Department of Gastroenterology as a super-speciality involves management of patients suffering",
      href: "www.rgcirc.org/clinical-services/interventional-gestroentrology-services/"
    },
    {
      image: images.nuclearMedicine,
      name: "Nuclear Medicine Services",
      para: "The department of Nuclear Medicine provides The {COMPANY_NAME}",
      href: "/clinical-services/nuclear-medicine-services/"
    }
  ];

  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-light py-3">
      <div className="container text-center">
        <h2 className="fw-bold text-secondary fs-2 mb-1">
          Clinical <span className="text-danger">Services</span>
        </h2>

        <UnderLine />
      </div>
      <div className="container">
        <div className="row justify-content-center g-3">
          {clinicalService.map((service) => {
            const isSelected = currentServiceId === service.id;

            return (
              <div
                key={service.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
              >
                <div
                  className={`w-100 border rounded-3 p-3 d-flex flex-row align-items-start gap-3 ${
                    isSelected
                      ? "text-white border-primary"
                      : "text-dark border-primary"
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: "#0074bc", cursor: "pointer" }
                      : { cursor: "pointer" }
                  }
                  // style={{ cursor: "pointer" ,}}
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className={isSelected ? "text-white" : "text-primary"}>
                    {service.icon}
                  </div>
                  <div>{service.para}</div>
                </div>
              </div>
            );
          })}
        </div>

        {mainImage
          .filter((service) => service.id === currentServiceId)
          .map((service) => (
            <div key={service.id} className="row text-start mt-5">
              <div className="col-12 col-md-6 order-2 order-md-1">
                <img
                  src={service.imageSrc}
                  alt={service.title}
                  className="img-fluid rounded w-100"
                />
              </div>
              <div className="col-12 col-md-6 order-2 order-1 order-md-2">
                <h3 className="fw-bold text-dark">{service.title}</h3>
                <p className="text-muted">{service.description}</p>

                {service.para1 && (
                  <div className="d-flex justify-content-start align-items-center mb-2">
                    <span className="text-primary me-1">{service.icon}</span>
                    <p className="mb-0 text-muted mt-1">{service.para1}</p>
                  </div>
                )}

                {service.para2 && (
                  <div className="d-flex justify-content-start align-items-center mb-2">
                    <span className="text-primary me-1">{service.icon}</span>
                    <p className="mb-0 text-muted mt-1">{service.para2}</p>
                  </div>
                )}

                <a
                  href={service.link}
                  className="btn btn-danger mt-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
      </div>

      <div className="container py-5">
        <h2 className="fw-bold text-secondary text-center fs-2 mb-1">
          Other <span className="text-danger">Services</span>
        </h2>

        <UnderLine />

        <div className="position-relative justify-content-center">
          <button
            type="button"
            onClick={scrollLeft}
            className="btn position-absolute top-50 translate-middle-y d-none d-sm-flex d-flex justify-content-center align-items-center"
            style={{
              left: -20,
              zIndex: 10,
              width: "40px",
              height: "40px",
              backgroundColor: "#f0f0f0",
              border: "none",
              borderRadius: "50%"
            }}
            aria-label="Scroll Left"
          >
            <FaArrowLeft className="fs-5" />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            className="btn position-absolute top-50 translate-middle-y d-none d-sm-flex d-flex justify-content-center align-items-center"
            style={{
              right: -20,
              zIndex: 10,
              width: "40px",
              height: "40px",
              backgroundColor: "#f0f0f0",
              border: "none",
              borderRadius: "50%"
            }}
            aria-label="Scroll Right"
          >
            <FaArrowRight className="fs-5" />
          </button>

          <div
            className="d-flex flex-column flex-sm-row overflow-auto px-0 px-sm-2"
            ref={sliderRef}
            style={{
              scrollBehavior: "smooth",
              gap: "1rem",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          >
            {otherServices.map((service, index) => (
              <div
                key={index}
                className="card border-primary text-center p-3 flex-shrink-0 col-12 col-sm-6 col-md-3 col-lg-between-3-4"
                style={{ maxWidth: "100%", minHeight: "200px" }}
              >
                <img
                  src={service.image}
                  alt={`Service ${index + 1}`}
                  className="card-img-top mx-auto"
                  style={{
                    height: "60px",
                    width: "64px",
                    objectFit: "contain"
                  }}
                />
                <div
                  className="card-body"
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    overflowWrap: "anywhere"
                  }}
                >
                  <h6 className="card-title fw-semibold">{service.name}</h6>
                  <p className="card-text text-muted">
                    {" "}
                    {service.para.replace("{COMPANY_NAME}", COMPANY_NAME)}
                  </p>
                </div>
                <div>
                  <a href={service.href} className="btn btn-danger btn-sm">
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicalService;
