import React from "react";
import "../Components/Header.css";
import { Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";

function Header() {

  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return '';
  }

  const user = localStorage.getItem("Users_Name");
  

  function handleClick() {}
  return (
    <>
      <Row>
        <Col  xs={12} md={12} lg={12} xl={12}>
          <Navbar expand="lg"className=" Header">
            <Container >
              <Navbar.Brand  className="Header-Title">GT POLL</Navbar.Brand>
             
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
                     Hello !! {capitalizeFirstLetter(user)}
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
