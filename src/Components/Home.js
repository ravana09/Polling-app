import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Components/Header";
import "../Components/home.css";

import SideNavBar from "./Navbar";
import Trending from "./Trending/Trending";

function Home({ children, showTrending = true }) {
  return (
    <>
      <Row>
        <Container fluid >
          <Row >
            <Col xs={12} md={12} lg={12} xl={12} className="Body_header">
              <Header />
             
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={3} lg={3} xl={3} className="Body_Navbar"  >
              <SideNavBar />
            </Col>
           
            <Col sm={12} md={6} lg={6} xl={6} className="Home-Body">
              {children}
            </Col>
            {/* {showTrending && (
              <Col xs={12} md={2} lg={2} xl={2} className="Home-SideNavbar">
                <Trending />
              </Col>
            )} */}
          
             <Col sm={12} md={3} lg={3} xl={3} >
                <Trending />
              </Col>
          </Row>
        </Container>
      </Row>
    </>
  );
}

export default Home;

