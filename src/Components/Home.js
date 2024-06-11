import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Components/Header";
import "../Components/Home.css";
import SideNavBar from "./Navbar";

function Home({ children }) {
  return (
    <>
    <Container fluid>
      <Row>
        
          <Row className="fixed-top">
            <Col xs={12}  >
              <Header />
            </Col>
          </Row>
        <Row>
          <Col xs={12} md={3} lg={3} xl={3} className="Home-SideNavbar">
            <SideNavBar />
          </Col>
          <Col xs={12} md={6} lg={6} xl={6} className="Home-Body">
            {children}
          </Col>
          <Col xs={12} md={3} lg={3} xl={3} className="Home-Body"></Col>
        </Row>
      </Row>
    </Container>
    </>
  );
}

export default Home;
  
