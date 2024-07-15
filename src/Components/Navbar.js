import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Nav, Navbar, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { BsArrowBarRight } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlus,
  faCheck,
  faUser,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "./SideNavBar.css";
import axios from "axios";

function NavBar() {
  const [show, setShow] = useState(false);
  const [searchData, setSearchData] = useState("");
  const user = sessionStorage.getItem("Users_Name") || "Guest";
  const userPhoneNUmber = sessionStorage.getItem("Users_PhoneNumber");
  const userID = sessionStorage.getItem("Id");
  const [Pollcategories, setPollcategories] = useState([]);
  const [showPollCategories, setshowPollCategories] = useState(false);
  const [showSearchBar, SetShowSearchBar] = useState(false);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  };

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    categories();
  }, []);

  const categories = async () => {
    try {
      const response = await axios.get(
        "http://49.204.232.254:84/category/getall"
      );

      setPollcategories(response.data);
      setshowPollCategories(true);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(Pollcategories, "Categories from state");
  const handleClick = (input) => {
    navigate(input);
    // console.log(input, "category id");
    handleClose();
  };

  const handleUser = () => {
    navigate("/UserDetails", {
      state: { userPhoneNUmber, userID },
    });
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    sessionStorage.removeItem("MobileNUmber ");
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
      title: "Logged out successfully",
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleSearch = () => {
    SetShowSearchBar(!showSearchBar);
  };

  return (
    <>
      {/* Desktop view */}
      <Row>
        <Col>
          <div className="sidebar" id="desktop_view">
            <Container>
              <Navbar expand="lg">
                <Row>
                  <Col md={12} sm={12} xl={12} lg={12}>
                    <Nav defaultActiveKey="/polling">
                      <div className="Nav_Links-Bar">
                        <Nav.Link
                          className="Navbar-Links"
                          onClick={() => handleClick("/polling")}
                        >
                          <FontAwesomeIcon
                            icon={faList}
                            className="Navbar_icon"
                          />{" "}
                          Poll List
                        </Nav.Link>
                        <Nav.Link
                          className="Navbar-Links"
                          onClick={() => handleClick("/AddPoll")}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="Navbar_icon"
                          />{" "}
                          Add Poll
                        </Nav.Link>
                        <Nav.Link
                          className="Navbar-Links"
                          onClick={() => handleClick("/VotedLIst")}
                        >
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="Navbar_icon"
                          />{" "}
                          Voted Polls
                        </Nav.Link>
                        <Nav.Link className="Navbar-Links" onClick={handleUser}>
                          <FontAwesomeIcon
                            icon={faUser}
                            className="Navbar_icon"
                          />{" "}
                          User Details
                        </Nav.Link>
                      </div>
                    </Nav>
                  </Col>
                </Row>
              </Navbar>
              <hr style={{ color: "grey" }} />
              {/* <Navbar expand="lg">
                <Row className="Category_Card">
                  <Col md={12} sm={12} xl={12} lg={12}>
                    <Card
                      style={{
                        width: "15rem",
                        backgroundColor: "#6dbecd",
                        color: "White",
                        borderRadius: "20px",
                      }}
                      
                    >
                      <Card.Header onClick={toggleVisibility}>
                        Categories
                      </Card.Header>
                      {isVisible && (
                        <Card.Body style={{ backgroundColor: "White" }}>
                          <div className="scrollable-content">
                            {showPollCategories &&
                              Pollcategories.map((category, index) => (
                                <Nav defaultActiveKey="/polling" key={index}>
                                  <div>
                                    <Nav.Link
                                      className="Category_Name"
                                      onClick={() => handleClick(category._id)}
                                    >
                                      {category.category_name}
                                    </Nav.Link>
                                  </div>
                                </Nav>
                              ))}
                          </div>
                        </Card.Body>
                      )}
                    </Card>
                  </Col>
                </Row>
              </Navbar> */}
              <Navbar expand="lg">
                <Row>
                  <Col md={12} sm={12} xl={12} lg={12}>
                    <Nav defaultActiveKey="/polling">
                      <div >
                        <Nav.Link
                          
                        >
                          <Card
                      style={{
                        width: "15rem",
                        backgroundColor: "#6dbecd",
                        color: "White",
                        borderRadius: "20px",
                        margin:"0px"
                      }}
                      
                    >
                      <Card.Header onClick={toggleVisibility}>
                        Categories
                      </Card.Header>
                      {isVisible && (
                        <Card.Body style={{ backgroundColor: "White" }}>
                          <div className="scrollable-content">
                            {showPollCategories &&
                              Pollcategories.map((category, index) => (
                                <Nav defaultActiveKey="/polling" key={index}>
                                  <div>
                                    <Nav.Link
                                      className="Category_Name"
                                      onClick={() => handleClick(category._id)}
                                    >
                                      {category.category_name}
                                    </Nav.Link>
                                  </div>
                                </Nav>
                              ))}
                          </div>
                        </Card.Body>
                      )}
                    </Card>
                         
                        </Nav.Link>
                      
                      </div>
                    </Nav>
                  </Col>
                </Row>
              </Navbar>
              <Button
                onClick={handleSignOut}
                className="signOut"
                style={{ backgroundColor: "rgb(55, 115, 116)", border: "none" }}
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
        </Col>
      </Row>

      {/* Mobile view */}

      <div className="Mobile_view_place_fixed">
        <Row>
          <Col>
            <Navbar expand="xl" id="Mobile_view">
              <Container className="Mobile_view_Navbar">
                <Navbar.Brand
                  href="/polling"
                  style={{
                    color: "#c5ebf2",
                    fontSize: "30px",
                    fontWeight: "250px",
                  }}
                >
                  Polling Booth
                </Navbar.Brand>
                <Navbar.Toggle />

                <Navbar.Collapse>
                  <div className="Mobile_Nav_links">
                    <Navbar.Text
                      onClick={() => handleClick("/polling")}
                      style={{ fontSize: 20, color: "white" }}
                    >
                      Hello, {capitalizeFirstLetter(user)}
                    </Navbar.Text>

                    <Nav className="me-auto">
                      <Nav.Link
                        className="Nav-Links"
                        onClick={() => handleSearch()}
                        style={{ color: "white", fontSize: "15px" }}
                      >
                        Search A poll
                      </Nav.Link>
                      {showSearchBar && (
                        <Form.Control
                          type="text"
                          placeholder="Search"
                          className="search-Bar"
                          aria-label="Search Bar"
                          value={searchData}
                          onChange={(e) => setSearchData(e.target.value)}
                        />
                      )}
                      <Nav.Link
                        className="Mobile_Nav-Links"
                        onClick={() => handleClick("/polling")}
                        style={{ color: "white", fontSize: "15px" }}
                      >
                        Poll List{" "}
                        {/* <FontAwesomeIcon
                          icon={faList}
                          className="Navbar_icon"
                        /> */}
                      </Nav.Link>
                      <Nav.Link
                        className="Nav-Links"
                        onClick={() => handleClick("/AddPoll")}
                        style={{ color: "white", fontSize: "15px" }}
                      >
                        Add Poll{" "}
                        {/* <FontAwesomeIcon
                          icon={faPlus}
                          className="Navbar_icon"
                        /> */}
                      </Nav.Link>
                      <Nav.Link
                        className="Nav-Links"
                        onClick={() => handleClick("/VotedLIst")}
                        style={{ color: "white", fontSize: "15px" }}
                      >
                        Voted Polls{" "}
                        {/* <FontAwesomeIcon
                          icon={faCheck}
                          className="Navbar_icon"
                        />{" "} */}
                      </Nav.Link>

                      <Nav.Link
                        onClick={handleUser}
                        style={{ color: "white", fontSize: "15px" }}
                        className="Nav-Links"
                      >
                        User Details
                        {/* <FontAwesomeIcon
                          icon={faUser}
                          className="Navbar_icon"
                        />{" "} */}
                      </Nav.Link>
                      <Nav.Link
                        onClick={toggleVisibility}
                        style={{ color: "white", fontSize: "15px" }}
                        className="Nav-Links"
                      >
                        Categories
                      </Nav.Link>
                      <Card
                        style={{ width: "15rem", borderRadius: "none",margin:"0px" ,marginBottom:'10px'}}
                        className="Categrory_Card_Mobile"
                      >
                        {isVisible && (
                          <Card.Body>
                            <div className="scrollable-content">
                              {showPollCategories &&
                                Pollcategories.map((category, index) => (
                                  <Nav defaultActiveKey="/polling" key={index}>
                                    <div className="Nav_Links-Bar">
                                      <Nav.Link
                                        className="Category_Name"
                                        onClick={() =>
                                          handleClick(category._id)
                                        }
                                      >
                                        {category.category_name}
                                      </Nav.Link>
                                    </div>
                                  </Nav>
                                ))}
                            </div>
                          </Card.Body>
                        )}
                      </Card>
                      <Nav.Link
                        onClick={handleSignOut}
                        style={{
                          paddingLeft: 20,
                          backgroundColor: "white",
                          width: 100,
                          height: "auto",
                          borderRadius: "20px",
                        }}
                      >
                        Sign Out
                      </Nav.Link>
                    </Nav>
                  </div>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default NavBar;
