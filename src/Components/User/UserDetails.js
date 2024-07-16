import React, { createContext, useEffect, useState } from "react";
import {
  Card,
  Container,
  Image,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./UserDetails.css";
import CoverImage from "../Images/CoverImg.jpg";
import profile from "../Images/Profile.jpeg";
import Polling from "../Polling";
import Nullprofile from "../Images/NullProfileImg.jpg";

export const userDetailsContext = createContext();

function UserDetails() {
  const [userDetails, setUserDetails] = useState({});
  const [polldata, setPollData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  let date = userDetails.joined_date;
  let date1 = new Date(date).toLocaleDateString();

  console.log(date1);

  const location = useLocation();
  const { userPhoneNUmber, userID } = location.state || {};

  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return "";
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/api/getProfile",
          { user_id: userID }
        );
        setUserDetails(response.data.user);
        console.log(response.data.user);
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
    // console.log(userpolls);
    OtherUserID = userID;
  }

  const handleUserInfo = () => {
    setShowUserDetails(!showUserDetails);
  };

  return (
    <userDetailsContext.Provider
      value={{ OtherUserID, userDeatilsPoll: true, userpolls }}
    >
      <>
        {/* <Container > */}
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div>
            <Row id="desktop-View">
              <Col sm={12} md={12} lg={12} xl={12}>
                <Card className="poll_card" style={{ boder: "none" }}>
                  <Card.Header
                    style={{
                      border: "2px solid white",
                      backgroundColor: "#5F9EA0",
                    }}
                  >
                    <Row>
                      <Col sm={6} md={6} lg={6} xl={6}>
                        <div className="userDetails_Details">
                          <div className="userDetails_Details_UserName">
                            {userDetails.user_name}
                          </div>

                          <hr />
                          <div className="userDetails_Details_Names">
                            <Row>
                              <Col sm={4} md={4} lg={4} xl={4}>
                                <div>{userDetails.created_polls.length}</div>
                                <div>post</div>
                              </Col>
                              <Col sm={4} md={4} lg={4} xl={4}>
                                <div>{userDetails.user_followers.length}</div>
                                <div>Followers</div>
                              </Col>
                              <Col sm={4} md={4} lg={4} xl={4}>
                                <div>{userDetails.user_following.length}</div>
                                <div>Following</div>
                              </Col>
                            </Row>
                          </div>
                          <hr />
                          <a href="#" onClick={handleUserInfo} style={{color:"white"}}>
                            {showUserDetails
                              ? "Hide  Details"
                              : "User Details"}
                          </a>
                          {showUserDetails && (
                            <div >
                              <div className="userDetails_Details_Names">
                                <span className="label">Email:</span>{" "}
                                {userDetails.email}
                              </div>
                              <div className="userDetails_Details_Names">
                                <span className="label">Mobile Number:</span>{" "}
                                {userDetails.phone_number}
                              </div>
                              <div className="userDetails_Details_Names">
                                <span className="label">Joined Date:</span>{" "}
                                {date1}
                              </div>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col sm={6} md={6} lg={6} xl={6}>
                        <div className="image_card">
                          <div>
                            <Card.Img
                              src={
                                userDetails.user_profile
                                  ? `http://49.204.232.254:84/${userDetails.user_profile}`
                                  : Nullprofile
                              }
                              // src={`http://49.204.232.254:84/${userDetails.user_profile}`}
                              className="UserDetails_profile"
                              // style={{height:"210px",width:"100%",objectFit:'cover'}}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body></Card.Body>
                </Card>
              </Col>
            </Row>

            <Row id="Mobile-View" style={{ margin: "0px" }}>
              <Col sm={12}>
                <Card style={{ boder: "none" }}>
                  <Card.Header
                    style={{
                      border: "2px solid white",
                      backgroundColor: "#5F9EA0",
                    }}
                  >
                    <Row>
                      <Col sm={6}>
                        <div className="image_card">
                          <div>
                            <Card.Img
                              src={
                                userDetails.user_profile
                                  ? `http://49.204.232.254:84/${userDetails.user_profile}`
                                  : Nullprofile
                              }
                              className="UserDetails_profile"
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="userDetails_Details">
                          <div className="userDetails_Details_UserName">
                            {capitalizeFirstLetter(userDetails.user_name)}
                          </div>
                          <div className="userDetails_Details_Names">
                            <span className="label">Email:</span>{" "}
                            {userDetails.email}
                          </div>
                          <div className="userDetails_Details_Names">
                            <span className="label">Mobile Number:</span>{" "}
                            {userDetails.phone_number}
                          </div>
                          <div className="userDetails_Details_Names">
                            <span className="label">Joined Date:</span> {date1}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body></Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
        {/* </Container> */}
      </>
    </userDetailsContext.Provider>
  );
}

export default UserDetails;
