// Import necessary dependencies
import React, { useState } from "react";
import { Button, Col, Offcanvas, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "./SideNavBar.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";

import { BsArrowBarRight } from "react-icons/bs";
// import RangeOutput from "./RangeOutput";
import Swal from "sweetalert2";

// Define the NavBar component
function NavBar() {
  // State for showing/hiding the Offcanvas menu
  const [show, setShow] = useState(false);

  // Function to close the Offcanvas menu
  const handleClose = () => {
    setShow(false);
  };

  // Function to open the Offcanvas menu
  const handleShow = () => {
    setShow(true);
  };

  // React Router's navigate function
  let navigate = useNavigate();

  // Function to handle navigation and close menu
  function handleClick(input) {
    navigate(input);
    handleClose();
  }

  const userPhoneNUmber = localStorage.getItem("Users_PhoneNumber");

  const userID = localStorage.getItem("Id");
  // console.log(userID)

  // Function to handle sign-out
  function handleSignOut() {
    localStorage.clear();
    localStorage.removeItem("MobileNUmber ");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Log out  successfully",
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  function handleUser() {
    navigate("/UserDetails", {
      state: { userPhoneNUmber: userPhoneNUmber, userID: userID },
    });
  }

  return (
    <>
      <Row>
        <Col>
          <div className="sidebar">
            <Container className="Headers">
              <Navbar expand="lg">
                <Row>
                  <Col md={12} sm={12} xl={12} lg={12} className="p-0">
                    <Nav defaultActiveKey="/home" className="flex-column ">
                      <div>
                        <Nav.Link
                          className="Nav-Links"
                          onClick={() => handleClick("/polling")}
                        >
                          Poll List
                        </Nav.Link>

                        <Nav.Link
                          className="Nav-Links"
                          onClick={() => handleClick("/AddPoll")}
                        >
                          Add Poll
                        </Nav.Link>
                        <Nav.Link
                          className="Nav-Links"
                          onClick={() => handleClick("/VotedLIst")}
                        >
                          Voted Polls
                        </Nav.Link>
                      </div>
                    </Nav>
                  </Col>
                </Row>
              </Navbar>
              <hr style={{ color: "grey", width: "50vh" }} />
              <Navbar id="desktop_view" expand="lg" className="p-0">
                <Row className="w-100 m-0">
                  <Col md={12} sm={12} className="p-0">
                    <Nav defaultActiveKey="/home" className="flex-column ">
                      <div>
                        <Nav.Link onClick={handleUser} className="Nav-Links">
                          User Details
                        </Nav.Link>
                      </div>
                      <b></b>
                    </Nav>
                  </Col>
                </Row>
              </Navbar>

              <Button
                onClick={handleSignOut}
                className="signOut "
                style={{ backgroundColor: "#FF4500", border: "none" }}
              >
                <Row>
                  <Col md={8}> Sign Out </Col>
                  <Col md={2}>
                    <BsArrowBarRight />
                  </Col>

                  <Col md={2}></Col>
                </Row>
              </Button>
            </Container>
          </div>

          <Navbar expand="lg" className="bg-body-tertiary " id="Mobile_view">
            <Container>
              <Navbar.Brand className="NavbarTitle" style={{ color: "#FF4500",fontSize:"200%" }}>GT Poll</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link
                    className="Nav-Links"
                    onClick={() => handleClick("/polling")}
                  >
                    Poll List
                  </Nav.Link>
                  <Nav.Link
                    className="Nav-Links"
                    onClick={() => handleClick("/AddPoll")}
                  >
                    Add Poll
                  </Nav.Link>

                  <Nav.Link
                    className="Nav-Links"
                    onClick={() => handleClick("/VotedLIst")}
                  >
                    Voted Polls
                  </Nav.Link>
                  <Nav.Link
                    className="Nav-Links"
                    onClick={() => handleClick("/SearchingPoll")}
                  >
                    Search A poll
                  </Nav.Link>
                  <Nav.Link onClick={handleUser} className="Nav-Links">
                    User Details
                  </Nav.Link>
                  {/* Sign-out button */}
                  <Nav.Link
                    onClick={handleSignOut}
                    style={{
                      paddingLeft: 20,
                      backgroundColor: "#FF895D",
                      width: 100,
                      height: "auto",
                    }}
                    className="d-flex align-items-end "
                  >
                    Sign Out
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
             
            </Container>
          </Navbar>
        </Col>
      </Row>
    </>
  );
}

// Export the NavBar component
export default NavBar;
