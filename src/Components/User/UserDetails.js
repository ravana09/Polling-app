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

// export const userDetailsContext = createContext();

function UserDetails() {
  const [userDetails, setUserDetails] = useState([]);
  const [polldata, setPollData] = useState(false);

  const location = useLocation();
  const { userPhoneNUmber, userID } = location.state || null;
  let pollingusetId=userID

  console.log(userPhoneNUmber, "userMobile");
  console.log(pollingusetId, "userid");

  let userDeatilsPoll = true;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/api/getProfile",
          {
            user_id:userID
          }
        );
        setUserDetails(response.data.user);
        console.log(response.data.user);
        if(response.status===200){
        setPollData(!polldata)}
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserDetails();
  }, [userPhoneNUmber]);
  let userpolls
  let OtherUserID

  if (polldata === true) {
     userpolls = userDetails.created_polls || null;
     OtherUserID =userID
     
    console.log(userpolls, "polling data");
    console.log(OtherUserID,"voted polls")
  } else {
    console.log("no data");
  }

  // let filteredVotedPolls = votedPolls ? votedPolls.filter(poll => userpolls.includes(poll)) : [];
  // console.log(filteredVotedPolls,"filtered")

  return (
    // <userDetailsContext.Provider value={{userId}}>
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

          <Card.Body></Card.Body>
        </Card>
        {polldata && (
          <Polling
           pollingState={userpolls}
            userDeatilsPoll={userDeatilsPoll} 
            UserID={OtherUserID}/>
        )}
      </Container>

  );
}

export default UserDetails;
