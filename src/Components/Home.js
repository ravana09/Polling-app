import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Components/Header";
import Polling from "../Components/Polling";
import AddPoll from "../Components/AddPoll"; 
import "../Components/Home.css";
import SideNavBar from "./Navbar";


function Home() {
  // State to manage which component to render
  // const [view, setView] = useState("polling");

  // Function to handle switching the view
  // const switchView = (newView) => {
  //   setView(newView);
  // };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Row className="fixed-top">
            <Col xs={12}>
              <Header />
            </Col>
          </Row>
        </Col>

        <Row>
          <Col xs={12} md={3} lg={3} xl={3} className="Home-SideNavbar  ">
            <SideNavBar />
          </Col>
          <Col xs={12} md={6} lg={6} xl={6} className="Home-Body">
            {/* Render Polling or AddPoll based on the value of 'view' state */}
           <Polling /> 
          </Col>
          <Col xs={12} md={3} lg={3} xl={3} className="Home-Body"></Col>
        </Row>
      </Row>
    </Container>
  );
}

export default Home;

