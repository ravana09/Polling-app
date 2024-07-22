import React, { createContext, useEffect, useState } from "react";
import {
  Card,
  Container,
  Image,
  Spinner,
  Alert,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./UserDetails.css";
import CoverImage from "../Images/CoverImg.jpg";
import profile from "../Images/Profile.jpeg";
import Polling from "../Polling";
import Nullprofile from "../Images/NullProfileImg.jpg";
import { FaCamera } from "react-icons/fa";
import Swal from "sweetalert2";
import loadingImage from "../Images/Loading .gif";

export const userDetailsContext = createContext();

function UserDetails() {
  const [userDetails, setUserDetails] = useState({});
  const [polldata, setPollData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //multiple polls
  const [multiplePolls, setMultiplePolls] = useState([]);
  //userdatils
  const [showUserDetails, setShowUserDetails] = useState(false);
  //polls
  const [sendPolls, setSendPolls] = useState(true);
  const [sendLiked, setSendLiked] = useState(false);
  const [sendCommented, setSendCommented] = useState(false);
  const [sendVotedPOlls, setSendVottedPolls] = useState(false);
  //profile
  const [profileUploaded, setProfileUploaded] = useState(false);

  let date = userDetails.joined_date;
  let date1 = new Date(date).toLocaleDateString();

  //user ID
  const loginUserID = sessionStorage.getItem("Id");

  const UserMobileNumber = sessionStorage.getItem("Users_PhoneNumber");

  const location = useLocation();
  const { userPhoneNUmber, userID } = location.state || {};
  const pollsUserid = userID;

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
          fetchMultiplePolls(response.data.user.created_polls);
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
  }, [userPhoneNUmber, profileUploaded]);

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

  const fetchMultiplePolls = async (polls) => {
    const res = await axios.post("http://49.204.232.254:84/polls/multipoll", {
      poll_ids: polls,
    });
    console.log(res.data, "MUltiplePOlls UserDetails");
    setMultiplePolls([]);
    setMultiplePolls(res.data);
  };

  //UserDetailsCreatedPoll

  const UserDetailsCreatedPoll = (polls) => {
    setSendPolls(!sendPolls);
    setSendCommented(false);
    setSendLiked(false);
    setSendVottedPolls(false);
    fetchMultiplePolls(polls);
  };
  const UserDetailsLikedPoll = (polls) => {
    setSendLiked(!sendLiked);
    console.log("clikced like", sendLiked);
    setSendPolls(false);
    setSendCommented(false);
    setSendVottedPolls(false);
    fetchMultiplePolls(polls);
  };
  const UserDetailsCommentedPoll = (polls) => {
    setSendCommented(!sendCommented);
    setSendPolls(false);
    setSendLiked(false);
    setSendVottedPolls(false);
    fetchMultiplePolls(polls);
  };

  const UserDetailsVotedPoll = (polls) => {
    setSendVottedPolls(!sendVotedPOlls);
    setSendPolls(false);
    setSendLiked(false);
    setSendCommented(false);
    fetchMultiplePolls(polls);
  };
  //profile
  const UpdateProfile = async () => {
    const { value: file } = await Swal.fire({
      title: "Change Profile Image ",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
      showCancelButton: true,
    });

    if (file) {
      console.log(file);
      try {
        const formData = new FormData();
        formData.append("profile", file);

        const response = await axios.post(
          "http://49.204.232.254:84/api/uploadprofile",
          formData
        );

        if (response.status === 200) {
          const imageUrl = response.data.profile;

          if (imageUrl && imageUrl.length > 0 && UserMobileNumber) {
            await axios.post("http://49.204.232.254:84/api/updateuser", {
              identifier: UserMobileNumber,
              user_profile: imageUrl,
            });
            if (response.status === 200) {
              setProfileUploaded(!profileUploaded);
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              Swal.fire({
                title: "Profile Changed Successfully",
                imageUrl: e.target.result,
                imageAlt: "The uploaded picture",
              });
              console.log(e.target.result);
            };
            reader.readAsDataURL(file);

            return imageUrl;
          } else {
            throw new Error(
              "Image URL is invalid or User mobile number is not defined"
            );
          }
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: err.message,
        });
        console.log(err);
      }
    }
  };

  return (
    <userDetailsContext.Provider
    // value={{ OtherUserID, userDeatilsPoll: true, userpolls }}
    >
      <>
        {loading ? (
          <div className="loading">
            <img src={loadingImage} alt="Loading image" />
            <h1>Loading</h1>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div>
            <Row id="desktop-View">
              <Col sm={12} md={12} lg={12} xl={12}>
                <Card className="poll_card" style={{ boder: "none" }}>
                  <Card.Header
                    className="userDetails_Card"
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
                                <center>
                                  <div>{userDetails.created_polls.length}</div>
                                  <div>post</div>
                                </center>
                              </Col>
                              <Col sm={4} md={4} lg={4} xl={4}>
                                <center>
                                  <div>{userDetails.user_followers.length}</div>
                                  <div>Followers</div>
                                </center>
                              </Col>
                              <Col sm={4} md={4} lg={4} xl={4}>
                                <center>
                                  {" "}
                                  <div>{userDetails.user_following.length}</div>
                                  <div>Following</div>
                                </center>
                              </Col>
                            </Row>
                          </div>
                          <hr />
                          <Button
                            onClick={handleUserInfo}
                            style={{
                              color: "white",
                              textDecoration: "none",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          >
                            {showUserDetails ? "Hide  Details" : "User Details"}
                          </Button>
                          {showUserDetails && (
                            <div>
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
                              className="UserDetails_profile"
                            />
                          </div>
                        </div>
                        <div>
                          <center>
                            <Button
                              variant="light"
                              onClick={UpdateProfile}
                              className="Upload_profile_button"
                            >
                              <FaCamera />
                            </Button>
                          </center>
                        </div>
                      </Col>
                    </Row>
                  </Card.Header>
                </Card>
              </Col>
            </Row>
            <Row id="Mobile-View">
              <Col sm={12}>
                <Card style={{ boder: "none", margin: "0px" }}>
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
                        </div>
                        <div>
                          <Button
                            onClick={handleUserInfo}
                            style={{
                              color: "white",
                              textDecoration: "none",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          >
                            {showUserDetails ? "Hide  Details" : "User Details"}
                          </Button>
                          {showUserDetails && (
                            <div>
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
                    </Row>
                  </Card.Header>
                  <Card.Body></Card.Body>
                </Card>
              </Col>
            </Row>
            <div>
              <div className="UserDetails_Comments_buttons_card">
                <Row>
                  <Col sm={3} md={3} lg={3} xl={3}>
                    <Button
                      style={{ backgroundColor: "#5f9ea0" }}
                      className="UserDetails_polls_data"
                      onClick={() => {
                        UserDetailsCreatedPoll(userDetails.created_polls);
                      }}
                    >
                      Created POlls
                    </Button>
                  </Col>
                  <Col sm={3} md={3} lg={3} xl={3}>
                    <Button
                      style={{ backgroundColor: "#5f9ea0" }}
                      className="UserDetails_polls_data"
                      onClick={() => {
                        UserDetailsVotedPoll(userDetails.voted_polls);
                      }}
                    >
                      Voted POlls
                    </Button>
                  </Col>
                  <Col sm={3} md={3} lg={3} xl={3}>
                    {loginUserID === userID && (
                      <Button
                        variant="info"
                        className="UserDetails_polls_data"
                        onClick={() => {
                          UserDetailsLikedPoll(userDetails.liked_polls);
                        }}
                      >
                        Liked Polls
                      </Button>
                    )}
                  </Col>
                  <Col sm={3} md={3} lg={3} xl={3}>
                    {loginUserID === userID && (
                      <div>
                        <Button
                          variant="info"
                          className="UserDetails_polls_data"
                          onClick={() => {
                            UserDetailsCommentedPoll(userDetails.created_polls);
                          }}
                        >
                          Commented Polls
                        </Button>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
              <div>
                {/* from polling */}
                <div className="d-grid ">
                  {sendPolls && multiplePolls.length > 0 && (
                    <div>
                      <center>
                        <div
                          className="Polls_Name_badge"
                          style={{ color: "white" }}
                        >
                          <h3> Created Polls</h3>
                        </div>
                      </center>
                      <Polling
                        UserCrestedPolls={multiplePolls}
                        UserID={userDetails.id}
                      />
                    </div>
                  )}
                </div>

                <div className="d-grid ">
                  {sendVotedPOlls && multiplePolls.length > 0 && (
                    <div>
                      <center>
                        <div
                          className="Polls_Name_badge"
                          style={{ color: "white" }}
                        >
                          <h3>Voted Polls</h3>
                        </div>
                      </center>
                      <Polling
                        UserLikedPolls={multiplePolls}
                        UserID={userDetails.id}
                      />
                    </div>
                  )}
                </div>

                <div className="d-grid ">
                  {sendLiked && multiplePolls.length > 0 && (
                    <div>
                      <center>
                        <div
                          className="Polls_Name_badge"
                          style={{ color: "white" }}
                        >
                          <h3>Liked Polls</h3>
                        </div>
                      </center>
                      <Polling
                        UserLikedPolls={multiplePolls}
                        UserID={userDetails.id}
                      />
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  {sendCommented && multiplePolls.length > 0 && (
                    <div>
                      <center>
                        <div
                          className="Polls_Name_badge"
                          style={{ color: "white" }}
                        >
                          <h3>Commented Polls</h3>
                        </div>
                      </center>
                      <Polling
                        UserCommendedPolls={multiplePolls}
                        UserID={userDetails.id}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </userDetailsContext.Provider>
  );
}

export default UserDetails;
