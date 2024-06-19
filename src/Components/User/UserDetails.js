import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, ListGroup, Row } from "react-bootstrap";
import Header from "../Header";
import NavBar from "../Navbar";
import "../User/UserDetails.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CoverImage from "../Images/CoverImg.jpg";
import profile from "../Images/Profile.jpeg";
import Polling from "../Polling";

function UserDetails() {
  const [userDetails, setUserDetails] = useState([]);
  const location = useLocation();
  const { userID } = location.state || null;

  console.log(userID, "userid");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getprofile/${userID}`
        );
        setUserDetails(response.data.user);
        console.log(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserDetails();
  }, [userID]);

  return (
    <>
      <Row>
        <Container fluid>
          <Col xs={12} md={12} lg={12} xl={12} className="User_page">
            <Card>
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Row style={{ position: "relative" }}>
                    <Col>
                      <Image src={CoverImage} className="Cover_img" fluid />

                      <Card.Title className="user_Name">
                        {userDetails.user_name}
                      </Card.Title>
                      <Card.Text>
                        {" "}
                        user Folllowers:
                        {userDetails.user_followers?.user_followers || 0}{" "}
                      </Card.Text>
                      <Card.Text>
                        {" "}
                        Phone Number: {userDetails.phone_number}{" "}
                      </Card.Text>
                      <Card.Text> Email: {userDetails.email}</Card.Text>

                      <Card.Text>
                        {" "}
                        Joined date: {userDetails.joined_date}
                      </Card.Text>

                      <Image
                        src={profile}
                        roundedCircle
                        className="Profile_img"
                      />
                    </Col>
                    <Card.Body></Card.Body>
                  </Row>
                </Col>
              </Row>
              <Polling userId={userID} />
            </Card>
          </Col>
        </Container>
      </Row>
    </>
  );
}

export default UserDetails;
