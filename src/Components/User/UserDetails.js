import React, { createContext, useEffect, useState } from "react";
import { Card, Container, Image, Spinner, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CoverImage from "../Images/CoverImg.jpg";
import profile from "../Images/Profile.jpeg";
import Polling from "../Polling";

export const userDetailsContext = createContext();

function UserDetails() {
  const [userDetails, setUserDetails] = useState({});
  const [polldata, setPollData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { userPhoneNUmber, userID } = location.state || {};

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/api/getProfile",
          { user_id: userID }
        );
        setUserDetails(response.data.user);
        console.log(response.data.user)
        if (response.status === 200) {
          setPollData(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchUserDetails();
    }
  }, [userPhoneNUmber, userID]);

  useEffect(() => {
    console.log("polldata changed:", polldata);
  }, [polldata]);

  let userpolls;
  let OtherUserID;

  if (polldata) {
    userpolls = userDetails.created_polls || [];
    console.log(userpolls)
    OtherUserID = userID;
  }

  return (
    <userDetailsContext.Provider value={{ OtherUserID, userDeatilsPoll: true, userpolls }}>
      <Container fluid>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <Card className="User_page" style={{ position: "relative" }}>
              <Image src={CoverImage} className="Cover_img" fluid />
              <Card.Title className="user_Name">{userDetails.user_name}</Card.Title>
              <div className="other_details">
                <Card.Text>Folllowers: {userDetails.user_followers?.user_followers || 0}</Card.Text>
                <Card.Text>Phone Number: {userDetails.phone_number}</Card.Text>
                <Card.Text>Email: {userDetails.email}</Card.Text>
                <Card.Text>Joined date: {userDetails.joined_date}</Card.Text>
              </div>
              <Image src={profile} roundedCircle className="Profile_img" />
              <Card.Body></Card.Body>
            </Card>
            {/* {polldata && (
              <Polling
                pollingState={userpolls}
                userDeatilsPoll={true}
                UserID={OtherUserID}
              />
            )} */}
          </>
        )}
      </Container>
    </userDetailsContext.Provider>
  );
}

export default UserDetails;
