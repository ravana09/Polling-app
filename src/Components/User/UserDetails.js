import React, { createContext, useEffect, useState } from "react";
import { Card, Col, Container, Image, ListGroup, Row } from "react-bootstrap";
import Header from "../Header";
import NavBar from "../Navbar";
import "../User/UserDetails.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CoverImage from "../Images/CoverImg.jpg";
import profile from "../Images/Profile.jpeg";
import Polling from "../Polling";

export const userDetailsContext = createContext();

function UserDetails() {
  const [userDetails, setUserDetails] = useState([]);

  const location = useLocation();
  const { userID } = location.state || null;

  console.log(userID, "userid");

  let userDeatilsPoll = true;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getprofile/${userID}`
        );
        setUserDetails(response.data.user);
        // console.log(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserDetails();
  }, [userID]);

  let userpolls = userDetails.created_polls || [];
  console.log(userpolls, "polling data");

  return (
    <userDetailsContext.Provider value={userID}>
      <Container fluid>
        <Card className="User_page" style={{ position: "relative" }}>
          <Image src={CoverImage} className="Cover_img" fluid />

          <Card.Title className="user_Name">{userDetails.user_name}</Card.Title>
          <div className="other_details">
            <Card.Text>
              {" "}
              Folllowers:
              {userDetails.user_followers?.user_followers || 0}{" "}
            </Card.Text>
            <Card.Text> Phone Number: {userDetails.phone_number} </Card.Text>
            <Card.Text> Email: {userDetails.email}</Card.Text>

            <Card.Text> Joined date: {userDetails.joined_date}</Card.Text>
          </div>
          <Image src={profile} roundedCircle className="Profile_img" />

          <Card.Body>
            
          </Card.Body>
        </Card>
        
        <Polling
              pollingState={userpolls}
              userDeatilsPoll={userDeatilsPoll}
            />
      </Container>
    </userDetailsContext.Provider>
  );
}

export default UserDetails;
