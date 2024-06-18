import React, { useEffect, useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import Header from "../Header";
import NavBar from "../Navbar";
import "../User/UserDetails.css";
import axios from "axios";
import { useLocation } from 'react-router-dom';

function UserDetails() {
  const [userDetails, setUserDetails] = useState([]);
  const location = useLocation();
  const  userID = location.state || null
  
  // console.log(userID)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getprofile/${userID}`);
        setUserDetails(response.data.user);
        console.log(response.data.user)
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserDetails();
  }, [userID]);

  return (
    <>
      <Row>
        <Container fluid style={{ marginLeft: "0px" }}>
          <Row className="fixed-top">
            <Col xs={12}>
              <Header />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={3} lg={3} xl={3} className="Home-SideNavbar">
              <NavBar />
            </Col>
            <Col xs={12} md={9} lg={9} xl={9} className="User_page">
              <Row>
                <Col
                  xs={12}
                  md={6}
                  lg={6}
                  xl={6}
                  className="UserDetails-Container"
                >
                  <Card style={{ width: "30rem",marginTop:"100px" }}>
                    <Card.Img
                      variant="top"
                      src="holder.js/100px180?text=Image cap"
                    />
                    <Card.Body>
                      {/* UserName */}
                      <Card.Title>Name: {userDetails.user_name}</Card.Title>
                      {/* UserDetails */}
                      <Card.Text> user Folllowers: </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item>Email: {userDetails.email}</ListGroup.Item>
                      <ListGroup.Item>Phone Number: {userDetails.phone_number}</ListGroup.Item>
                      <ListGroup.Item>Joined date: {userDetails.joined_date}</ListGroup.Item>
                    </ListGroup>
                   
                  </Card>
                </Col>
                <Col
                  xs={12}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{ backgroundColor: "black" }}
                >
                  {/* <Row>
                    <Col style={{ backgroundColor: "blue" }}></Col>
                    <Col></Col>
                  </Row> */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Row>
    </>
  );
}

export default UserDetails;
