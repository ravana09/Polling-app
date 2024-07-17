import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Stack, Badge, Button, Image } from "react-bootstrap";
import RangeOutput from "./RangeOutput"; // Import the RangeOutput component
import PollStartingTime from "./Timing/PollStartingTime";
import Nullprofile from "../Components/Images/NullProfileImg.jpg";
import { useNavigate } from "react-router-dom";

function VotedList() {
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  let [userDetails, setUserDetails] = useState(false);
  let navigate = useNavigate();

  const User_id = sessionStorage.getItem("Id");

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const res = await axios.post("http://49.204.232.254:84/polls/getall", {
          user_id: User_id,
        });
        setFetchData(res.data);
      } catch (err) {
        console.log("Error", err);
      }
    };

    const fetchVotedPolls = async () => {
      console.log(User_id);
      try {
        const url = "http://49.204.232.254:84/polls/getvoted";
        const response = await axios.post(url, {
          user_id: User_id,
        });
        const { pollIds } = response.data;
        setVotedPollIds(pollIds);
        console.log(pollIds);
      } catch (error) {
        console.error("Error fetching voted polls:", error);
      }
    };

    fetchPollData();
    fetchVotedPolls();
  }, [User_id]);

  // Filter fetchData based on votedPollIds
  const votedPollData = fetchData.filter((poll) =>
    votedPollIds.includes(poll._id)
  );

  console.log(votedPollData.data);

  const handleUser = (userId) => {
    setUserDetails(!userDetails);

    navigate("/UserDetails", { state: { userID: userId } });
  };
  const handleFollow = (Followid) => {
    console.log(Followid, "follow user");
  };

  const handleCatergory = (id) => {
    console.log(id);
  };

  return (
    <Row className="polling_row">
      <div className="pollingBody">
        <Col md={12} sm={12}>
          {votedPollData.map((apiData) => (
            <div key={apiData._id}>
              <Card className="poll_card">
                <Card.Header>
                  <Row>
                    <Col sm={6} md={6} lg={6} xl={6}>
                      <Row>
                        <Col sm={9} md={3} lg={3} xl={3}>
                          <div className="ImageFrame">
                            <Image
                              src={
                                apiData.createdBy.user_profile
                                  ? `http://49.204.232.254:84/${apiData.createdBy.user_profile}`
                                  : Nullprofile
                              }
                              // src={profile}
                              roundedCircle
                              style={{ width: "80px", height: "80px" }}
                              alt="profile picture"
                            />
                          </div>
                        </Col>
                        <Col sm={3} md={9} lg={9} xl={9}>
                          <div style={{ marginTop: "15px" }}>
                            <div>
                              <Card.Link
                                onClick={() =>
                                  handleUser(apiData.createdBy._id)
                                }
                                className="POll_user_name"
                              >
                                {apiData.createdBy?.user_name}
                              </Card.Link>
                            </div>
                            <div>
                              <PollStartingTime
                                createdTime={apiData.createdAt}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={0} md={2} lg={2} xl={2}></Col>
                    <Col sm={0} md={2} lg={2} xl={2}>
                      <div style={{ marginTop: "15px" }}>
                        <div>{`Title:   ${apiData.title}`}</div>
                        <div>Status:{apiData.status}</div>
                      </div>
                    </Col>
                    <Col sm={0} md={2} lg={2} xl={2}>
                      <div style={{ marginTop: "15px" }}>
                        <div>
                          <Button
                            onClick={() => {
                              handleFollow(apiData.createdBy._id);
                            }}
                          >
                            Follow
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Row className="poll_Card_body">
                    <Col sm={9} md={9} lg={9} xl={9}>
                      <Card.Title>{apiData.question}</Card.Title>
                    </Col>
                    <Col sm={3} md={3} lg={3} xl={3}>
                      <div>
                        <Button
                          onClick={handleCatergory(apiData.category._id)}
                          variant="info"
                          className="Category_Name"
                          style={{
                            fontSize: "75%",
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          {apiData.category[0]?.category_name}
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  <Stack direction="horizontal" gap={2}></Stack>
                  {votedPollIds.includes(apiData._id) ? (
                    <RangeOutput
                      pollId={apiData._id}
                      selectOption={selectedOption}
                      setSelectedOption={setSelectedOption}
                      createdTime={apiData.created_date}
                      endingTime={apiData.expirationTime}
                    />
                  ) : (
                    <p>You haven't voted for this poll yet.</p>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
          {/* <Row> */}
          {/* <Col sm={3} md={3} lg={3} xl={3}>
                        <Button
                          onClick={() => handleCheckboxChange(apiData._id)}
                          style={{ backgroundColor: "inherit", border: "none" }}
                        >
                          {likedPolls && likeClikedPolls === apiData._id ? (
                            <FaHeart
                              style={{ color: "red", fontSize: "24px" }}
                            />
                          ) : (
                            <FaRegHeart
                              style={{ color: "black", fontSize: "24px" }}
                            />
                          )}
                        </Button>
                        <span>Like</span>
                      </Col>
                      <Col sm={3} md={3} lg={3} xl={3}>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            handlePoll(apiData._id);
                          }}
                        >
                          Comments
                        </Button>
                      </Col>
                    </Row> */}
        </Col>
      </div>
    </Row>
  );
}

export default VotedList;
