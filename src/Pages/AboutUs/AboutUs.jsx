import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import Banner from "../../Components/Banner/Banner";
import videoData from "../../Utils/VideosUrl";
import Footer from "../../Components/Footer/Footer";
import { useState } from "react";

const AboutPage = () => {
  const [activeItem, setActiveItem] = useState(null);
  const getItemStyle = (item) => {
    return activeItem === item
      ? { backgroundColor: "#d0eaff", color: "#000", border: "none" }
      : {};
  };

  return (
    <div className="w-100">
      <Banner videoSrc={videoData.DnaBackground} title="About Novacare" />
      <Container className="my-2 my-md-3">
        <Row className="g-4">
          <Col xs={12} md={8}>
            <div>
              <p className="text-muted fs-6 fs-md-5 lh-base">
                <strong>NOVACARE</strong> is a comprehensive healthcare center
                committed to delivering high-quality, affordable, and accessible
                medical services across multiple specialties. Since its
                establishment in 1996, NOVACARE has continuously evolved to meet
                the changing healthcare needs of the community.
              </p>

              <p className="text-muted fs-6 fs-md-5 lh-base">
                Founded with a vision to provide compassionate and ethical
                healthcare, NOVACARE operates as a not-for-profit institution.
                Our approach is patient-first — ensuring that every individual
                receives dignified, personalized care regardless of their
                financial background.
              </p>

              <p className="text-muted fs-6 fs-md-5 lh-base">
                We offer a wide range of medical services including internal
                medicine, surgery, cardiology, orthopedics, gynecology,
                pediatrics, diagnostics, and more — all under one roof. Our
                multidisciplinary teams work collaboratively to ensure
                coordinated and effective care for every patient.
              </p>

              <p className="text-muted fs-6 fs-md-5 lh-base">
                NOVACARE is powered by state-of-the-art infrastructure and
                advanced medical technologies, enabling accurate diagnoses and
                modern treatment approaches. We continuously invest in upgrading
                our facilities to match international standards.
              </p>

              <p className="text-muted fs-6 fs-md-5 lh-base">
                Beyond clinical care, we actively engage in public health
                awareness, preventive screenings, wellness programs, and
                community outreach to promote healthier living. NOVACARE is not
                just a hospital — it’s a trusted health partner for families
                across all stages of life.
              </p>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <Card className="mb-4">
              <Card.Header
                className="text-white fw-bold"
                style={{ backgroundColor: "#0074bc" }}
              >
                Learn More
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  href="#"
                  onClick={() => setActiveItem("history")}
                  active={activeItem === "history"}
                  style={getItemStyle("history")}
                >
                  Our History & Milestones
                </ListGroup.Item>

                <ListGroup.Item
                  action
                  href="#"
                  onClick={() => setActiveItem("awards")}
                  active={activeItem === "awards"}
                  style={getItemStyle("awards")}
                >
                  Awards & Recognitions
                </ListGroup.Item>

                <ListGroup.Item
                  action
                  href="#"
                  onClick={() => setActiveItem("accreditations")}
                  active={activeItem === "accreditations"}
                  style={getItemStyle("accreditations")}
                >
                  Accreditations & Certifications
                </ListGroup.Item>

                <ListGroup.Item
                  action
                  href="#"
                  onClick={() => setActiveItem("vision")}
                  active={activeItem === "vision"}
                  style={getItemStyle("vision")}
                >
                  Vision, Mission & Core Values
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default AboutPage;
