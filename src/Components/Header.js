import React from "react";
import "../Components/Header.css";
import { Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";

function Header() {
  function handleClick() {}
  return (
    <>
      <Row>
        <Col  xs={12} md={12} lg={12} xl={12}>
          <Navbar expand="lg"className=" Header">
            <Container >
              <Navbar.Brand href="#home" className="Header-Title">GT POLL</Navbar.Brand>
              {/* <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end"> */}
                <Form inline>
                  <Row>
                    <Col xs="auto">
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        className="search-Bar "
                      />
                    </Col>
                    
                  </Row>
                </Form>
                <Navbar.Text>
                  <Nav.Link
                    onClick={() => handleClick("/home")}
                    style={{ fontSize: 20 }}
                  >
                    Hello !! {localStorage.getItem("Phone Number ")}
                  </Nav.Link>
                </Navbar.Text>
              {/* </Navbar.Collapse> */}
            </Container>
          </Navbar>
        </Col>
      </Row>
    </>
  );
}

export default Header;
