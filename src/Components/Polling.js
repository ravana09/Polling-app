import React, { createContext, useContext, useEffect, useState } from "react";
import "./polling.css";

import {
  Card,
  Col,
  Form,
  Row,
  Button,
  Stack,
  Badge,
  Image,
  ListGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import RangeOutput from "./RangeOutput";
import { useLocation, useNavigate } from "react-router-dom";
import PollEndingTime from "./Timing/PollEndingTime";
import PollStartingTime from "./Timing/PollStartingTime";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { SearchContext } from "./Header";
import profile from "../Components/Images/Profile.jpeg";
import Nullprofile from "../Components/Images/NullProfileImg.jpg";
import { userDetailsContext } from "./User/UserDetails";
import loadingImage from "../Components/Images/Loading .gif";
export const TimerContext = createContext();
export const likeContext = createContext();

function Polling({
  UserCrestedPolls,
  UserID,
  UserLikedPolls,
  UserCommendedPolls,
  pollUserVoted,
  searchPoll,
  categoryPolls,
}) {
  const [fetchData, setFetchData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [votedPollIds, setVotedPollIds] = useState(() => {
    const storedVotedPollIds = sessionStorage.getItem("votedPollIds");
    return storedVotedPollIds ? JSON.parse(storedVotedPollIds) : [];
  });
  const [pollId, setPollId] = useState("");

  // console.log(searchPoll, "poll searched  polls ");

  const [searchingPoll, setSearchingPoll] = useState();

  const [voteCount, setVoteCount] = useState(0);

  const searchText = useContext(SearchContext);
  const [timer, setTimer] = useState(true);

  const [loading, setLoading] = useState(true);
  let [userDetails, setUserDetails] = useState(false);

  const [likedPolls, setLikedPolls] = useState([]);
  const [likepoll, setLikepoll] = useState({});

  const [pollEndTime, setpollEndtime] = useState(true);

  //Trending Poll id
  const location = useLocation();

  let { data } = location.state || {};

  console.log(data);

  const otherUserID = UserID;
  let UserId = sessionStorage.getItem("Id");
  let navigate = useNavigate();

  const handleData = (e) => {
    setSelectedOption(e.target.value);
  };

  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOption && pollId) {
      try {
        const response = await axios.post(
          "http://49.204.232.254:84/polls/voteonpoll",
          {
            poll_id: pollId,
            user_id: UserId,
            option: selectedOption,
          }
        );
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Your Poll has Been Saved",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          if (!votedPollIds.includes(pollId)) {
            const updatedVotedPollIds = [...votedPollIds, pollId];
            setVotedPollIds(updatedVotedPollIds);
            sessionStorage.setItem(
              "votedPollIds",
              JSON.stringify(updatedVotedPollIds)
            );
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `Error voting: ${
            error.response ? error.response.data.error : error.message
          }`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  //fetching data
  useEffect(() => {
    if (UserCrestedPolls && UserCrestedPolls.length > 0) {
      setLoading(false);
      setFetchData(UserCrestedPolls);
      console.log(UserCrestedPolls, "pollid from user");
      fetchVotedPolls();
    } else if (UserLikedPolls && UserLikedPolls.length > 0) {
      setLoading(false);
      setFetchData(UserLikedPolls);
      console.log(UserLikedPolls, "pollid from liked");
      fetchVotedPolls();
    } else if (UserCommendedPolls && UserCommendedPolls.length > 0) {
      setLoading(false);
      setFetchData(UserCommendedPolls);
      console.log(UserCommendedPolls, "pollid from Commanded");
      fetchVotedPolls();
    } else if (pollUserVoted && pollUserVoted.length > 0) {
      setLoading(false);
      setFetchData(pollUserVoted);
      console.log(pollUserVoted, "pollid from Commanded");
      // UserVotedPolls();
      fetchVotedPolls();
    } else if (searchPoll && searchPoll.length > 0) {
      setLoading(false);
      setFetchData(searchPoll);
      console.log(searchPoll, "serached polls from search");
      fetchVotedPolls();
    } else if (categoryPolls && categoryPolls.length > 0) {
      setLoading(false);
      setFetchData(categoryPolls);
      console.log(categoryPolls, "serached polls from search");
      fetchVotedPolls();
    } else if (data) {
      // console.log(data)
      fetchPollDetails(data);
      fetchVotedPolls();
    } else {
      fetchPollData();
      fetchVotedPolls();
      // console.log("polling");
    }
  }, [userDetails, data]);

  //polling fetching
  const fetchPollData = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://49.204.232.254:84/polls/getall", {
        user_id: UserId,
      });
      setFetchData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching poll data:", err);
    }
    setLoading(false);
  };
  //polling voted polls
  const fetchVotedPolls = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/polls/getvoted",
        {
          user_id: UserId,
        }
      );
      const { pollIds } = response.data;
      // console.log(response.data)
      setVotedPollIds(pollIds);
    } catch (error) {
      console.error("Error fetching voted polls:", error);
    }
    setLoading(false);
  };

  //uservoted polls
  // const UserVotedPolls = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       "http://49.204.232.254:84/polls/getvoted",
  //       {
  //         user_id: otherUserID,
  //       }
  //     );
  //     const { pollIds } = response.data;
  //     // console.log(response.data)
  //     setVotedPollIds(pollIds);
  //   } catch (error) {
  //     console.error("Error fetching voted polls:", error);
  //   }
  //   setLoading(false);
  // };

  //trendinPoll
  async function fetchPollDetails(pollId) {
    // console.log(pollId,'function trendingPoll')
    try {
      // console.log(pollId,"try")
      const response = await axios.post(
        "http://49.204.232.254:84/polls/getone",
        {
          poll_id: pollId,
          user_id: UserId,

        }
      );
      setFetchData([response.data]);
      console.log(response.data,"polling trending ");
      setLoading(false);
    } catch (err) {
      console.log("Error fetching poll details:", err);
    }
  }

  //search
  useEffect(() => {
    const fetchPollById = async () => {
      if (searchingPoll) {
        setLoading(true);
        try {
          const response = await axios.get(
            "http://49.204.232.254:84/polls/search",
            {
              query: searchText,
            }
          );
          setFetchData([response.data]);
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      }
    };
    fetchPollById();
  }, [searchingPoll]);

  // const displayedData = searchResults ? [searchResults] : fetchData;

  //Comments
  const handlePoll = (poll) => {
    // console.log(poll);

    navigate("/Comments", { state: { pollID: poll } });
  };

  //UserDeatils
  const handleUser = (userId) => {
    setUserDetails(!userDetails);

    navigate("/UserDetails", { state: { userID: userId } });
  };

  //category
  const handleCatergory = (id) => {
    navigate("/Categrory", { state: { pollId: id } });
    console.log(id, "category id");
  };

  //like
  const handleLikeButton = async (pollId) => {
    try {
      const response = await axios.post(
        "http://49.204.232.254:84/polls/likeonpoll",
        {
          poll_id: pollId,
          user_id: UserId,
        }
      );
      console.log(response.data, "Poll liked");

      if (response.data.message === "Like recorded successfully") {
        setLikepoll({ [pollId]: true });
        setLikedPolls([...likedPolls, pollId]);
        Swal.fire({
          icon: "success",
          title: "Poll liked successfully!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else if (response.data.message === "Like removed successfully") {
        setLikepoll({ [pollId]: false });
        setLikedPolls(likedPolls.filter((id) => id !== pollId));
        Swal.fire({
          icon: "success",
          title: "Like removed!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error("Error in liking poll", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while liking the poll.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  //follow user
  const handleFollow = async (Followid) => {
  console.log(Followid,"followers id ")
    try {
      const res = await axios.post("http://49.204.232.254:84/api/follow", {
        follow_user_id:Followid,
        user_id: UserId,
      }
  )
  if(res.status===200){
      alert("follwed")
  }else{
    alert("not foLLOWING ")
  }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TimerContext.Provider value={{ timer, setTimer }}>
      <div>
        <Row className="polling_row">
          <div className="pollingBody">
            <Col md={12} sm={12}>
              {loading ? (
                <div className="loading">
                  <img src={loadingImage} alt="Loading image" />
                  <h1>Loading</h1>
                </div>
              ) : (
                fetchData.map((apiData) => (
                  <div key={apiData._id}>
                    <Card className="poll_card">
                      <Card.Header>
                        <Row>
                          <Col sm={12} md={6} lg={6} xl={6}>
                            <Row>
                              <Col xs={5} sm={6} md={3} lg={3} xl={3}>
                                <div className="ImageFrame">
                                  <Image
                                    src={
                                      apiData.createdBy.user_profile
                                        ? `http://49.204.232.254:84/${apiData.createdBy.user_profile}`
                                        : Nullprofile
                                    }
                                    roundedCircle
                                    style={{ width: "80px", height: "80px" }}
                                    alt="profile picture"
                                  />
                                </div>
                              </Col>
                              <Col xs={7} sm={6} md={9} lg={9} xl={9}>
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
                          <Col sm={6} md={2} lg={2} xl={2}>
                            <div className="POll_header_status">
                              <div>{`Title: ${apiData.title}`}</div>
                              <div>Status:{apiData.status}</div>
                            </div>
                          </Col>
                          {UserId !== apiData.createdBy._id && (
                            <Col sm={6} md={2} lg={2} xl={2}>
                              <div className="poll_follow_button">
                                <div>
                                  <Button
                                    className="Follow_button"
                                    onClick={() => {
                                      handleFollow(apiData.createdBy._id);
                                    }}
                                  >
                                    {apiData.createdBy?.isFollowing === true
                                      ? "UnFollow"
                                      : "Follow"}
                                    {/* Follow */}
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          )}
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
                                onClick={() => {
                                  handleCatergory(apiData.category[0]._id);
                                }}
                                variant="info"
                                className="Poll_Category_Name"
                                style={{
                                  color: "white",
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
                          <Card className="innerCard">
                            <Card.Header className="cardHeader">
                              <Row>
                                <Col sm={4}>{apiData.voters.length} votes</Col>
                                <Col sm={4}></Col>
                                <Col sm={4}>
                                  <PollEndingTime
                                    createdTime={apiData.created_date}
                                    endingTime={apiData.expirationTime}
                                    setpollEndtime={setpollEndtime}
                                  />
                                </Col>
                              </Row>
                            </Card.Header>
                            <Card.Body>
                              <Form onSubmit={handleSubmit}>
                                {apiData.options.map((option, index) => (
                                  <Card.Title
                                    key={index}
                                    style={{ margin: 10 }}
                                  >
                                    <Form.Check
                                      type="radio"
                                      label={option.option}
                                      value={option.option}
                                      onChange={(e) => {
                                        handleData(e);
                                        setPollId(apiData._id);
                                      }}
                                      checked={selectedOption === option.option}
                                      className="formRadio custom-radio"
                                      style={{ margin: 10 }}
                                    />
                                  </Card.Title>
                                ))}
                                {apiData._id === pollId && timer && (
                                  <Button
                                    type="submit"
                                    style={{
                                      margin: 10,
                                      backgroundColor: "grey",
                                    }}
                                  >
                                    Vote
                                  </Button>
                                )}
                              </Form>
                            </Card.Body>
                          </Card>
                        )}
                        <div className="Tools-Bar">
                          <Row className="poll_Card_body">
                            <Col sm={3} md={3} lg={3} xl={3}>
                              <div>
                                <Button
                                  onClick={() => handleLikeButton(apiData._id)}
                                  style={{
                                    backgroundColor: "inherit",
                                    border: "none",
                                  }}
                                >
                                  {apiData.likers.some(
                                    (liker) => liker._id === UserId
                                  ) ? (
                                    <FaHeart
                                      style={{
                                        color: "red",
                                        fontSize: "24px",
                                      }}
                                    />
                                  ) : (
                                    <FaRegHeart
                                      style={{
                                        color: "black",
                                        fontSize: "24px",
                                      }}
                                    />
                                  )}
                                </Button>
                                Like
                              </div>
                            </Col>
                            <Col sm={3} md={3} lg={3} xl={3}>
                              <Button
                                variant="primary"
                                onClick={() => handlePoll(apiData._id)}
                              >
                                Comments
                              </Button>
                            </Col>
                            <Col sm={3} md={3} lg={3} xl={3}>
                              share
                            </Col>
                          </Row>
                        </div>
                      </Card.Body>
                    </Card>
                    <hr className="POll_card_Hr" />
                  </div>
                ))
              )}
            </Col>
          </div>
        </Row>
      </div>
    </TimerContext.Provider>
  );
}

export default Polling;
