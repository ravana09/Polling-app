// Import necessary dependencies
import React, { useState } from "react";
import { Button, Col, Offcanvas, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "../Components/Navbar.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";

import { BsArrowBarRight } from "react-icons/bs";
import RangeOutput from "./RangeOutput";
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
    // if (input === "/AddPoll") {
    //   Switch view to AddPoll when Add Poll button is clicked
    //   switchView("AddPoll");
    // } else {
    //   navigate(input);
    //   handleClose();
    // }
  }

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

  // Return JSX for NavBar component
  return (
    <>
      <Row>
        <Col>
          <div className="sidebar">
            <Container>
              <Navbar id="desktop_view" expand="lg" className="p-0">
                <Row className="w-100 m-0">
                  <Col md={12} sm={12} className="p-0">
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
                          onClick={() => handleClick("/polling")}
                        >
                          Services
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
                        {/* <Nav.Link
                          className="Nav-Links"
                          onClick={() => handleClick("/SearchingPoll")}
                        >
                          Search A poll
                        </Nav.Link> */}
                      </div>
                      <b>
                        {" "}
                        <hr />
                      </b>

                      {/* Sign-out button */}
                    </Nav>
                    {/* </Navbar.Collapse> */}
                  </Col>
                </Row>
              </Navbar>

              <Button
                onClick={handleSignOut}
                className="d-flex align-items-end m-10 signOut "
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

          <Navbar expand="lg" id="Mobile_view" className="bg-body-tertiary">
            <Container className="Mobile_container">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link
                    onClick={() => handleClick("/polling")}
                    style={{ paddingLeft: 20 }}
                  >
                    Poll List
                  </Nav.Link>
                  <Nav.Link
                    className="Nav-Links"
                    onClick={() => handleClick("/AddPoll")}
                    style={{ paddingLeft: 20 }}
                  >
                    Add Poll
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => handleClick("/home")}
                    style={{ paddingLeft: 20 }}
                  >
                    Clients
                  </Nav.Link>
                  <Nav.Link
                    className="Nav-Links"
                    onClick={() => handleClick("/VotedLIst")}
                    style={{ paddingLeft: 20 }}
                  >
                    Voted Polls
                  </Nav.Link>
                  <Nav.Link
                    className="Nav-Links"
                    onClick={() => handleClick("/SearchingPoll")}
                    style={{ paddingLeft: 20 }}
                  >
                    Search A poll
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
